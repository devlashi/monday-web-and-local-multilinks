import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
import toast from "react-hot-toast";

export async function getDogColumnLongTextValue(mondayClient, boardId, itemId) {

  // Step 1: Get the column ID for "dog column"
  const columnsQuery = `
    query {
    boards(ids: ${boardId} ) {
    columns {
      id
      title
    }
    }
    }
  `;

  const columnsRes = await mondayClient.api(columnsQuery);
  
  const linksColumn = columnsRes.data.boards[0].columns.find(col => col.title === "Super Links (Don't Update Manually)");
  if (!linksColumn) throw new Error('Column "dog column" not found');
  

  // Step 2: Get the long text value for the item
  const itemQuery = `
        query {
        items(ids: [${itemId}]) {
            column_values {
            id
            value
            type
            text
            }
        }
    }
  `;
  const itemRes = await mondayClient.api(itemQuery);
  const columnValue = itemRes.data.items[0].column_values.find(cv => cv.id === linksColumn.id);
  return columnValue ? columnValue.text : null;
}

export function openLink(url,setNotConnetedBannerState, setOpenUrlResponse){
  setNotConnetedBannerState(false);
  setOpenUrlResponse(0);
  if(url == null || url == "") return;
  if (url.startsWith("http") ) {
    window.open(url, "_blank");
    return;
  }
  if(url.startsWith('www.')){
    window.open("http://"+url, "_blank");
    return;
    }

  let token = localStorage.getItem('token');
  if (token == null){
    setOpenUrlResponse(5);
    return;
  }

  const parts = token.split("-");
  const port = parts[parts.length - 1];
  const code = parts.slice(0, -1).join("-"); // Everything except the last part

  fetch(`http://localhost:${port}/api/open/${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'bearer': code
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Received data:', data);
        if (data === 3) {
            setOpenUrlResponse(3);
        }
        // You can now use `data` as needed
    })
    .catch(error => {
        console.error('Fetch error:', error);
        setNotConnetedBannerState(true);
    });
}

export async function getItemForKey(monday,key){
  const res = await monday.storage.getItem(key);
  console.log(res);
  return res.data;
}

export async function setItemForKey(monday, key,value ,previousVersion){
  await monday.storage.setItem(key,value,{previous_version:previousVersion});
}

export async function updateDescription(
  monday,
  key,
  index,
  linksListWithVersion,
  newValue,
  setLinksListWithVersion
) {
  let oldValues = JSON.stringify(linksListWithVersion);
  let description = linksListWithVersion.list[index][0];
  if (description === newValue?.trim()) return;

  try {
    const newList = [...linksListWithVersion.list];
    newList[index] = [(newValue || "").trim(), newList[index][1]];

    const newVersionedList = {
      list: newList,
      version: linksListWithVersion.version,
    };

    await setItemForKey(
      monday,
      key,
      JSON.stringify(newList),
      linksListWithVersion.version
    );

    const res = await getItemForKey(monday, key);
    console.log("updated response", res);

    newVersionedList.version = res.version;
    console.log("new version", newVersionedList);
    
    setLinksListWithVersion(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values");
    setLinksListWithVersion(JSON.parse(oldValues));
  }
}

export async function updateUrl(
  monday,
  key,
  index,
  linksListWithVersion,
  newValue,
  setLinksListWithVersion
) {
  const oldValues = JSON.stringify(linksListWithVersion);
  const currentUrl = linksListWithVersion.list[index][1];

  if (
  (newValue?.startsWith('"') && newValue?.endsWith('"')) ||
  (newValue?.startsWith("'") && newValue?.endsWith("'"))
  ) {
    newValue = newValue.slice(1, -1);
  }
    
  const trimmedNewValue = (newValue || "").trim();
  const encodedNewValue = trimmedNewValue;

  if (currentUrl === encodedNewValue) return;

  try {
    const newList = [...linksListWithVersion.list];
    newList[index][1] = encodedNewValue;

    if (newList[index][0] === "") {
      const url = decodeURIComponent(newList[index][1]);
      newList[index][0] = url.length > 20
        ? "..." + url.slice(-20)
        : url;
    }

    const newVersionedList = {
      list: newList,
      version: linksListWithVersion.version,
    };

    await setItemForKey(
      monday,
      key,
      JSON.stringify(newList),
      linksListWithVersion.version
    );

    const res = await getItemForKey(monday, key);
    console.log("updated response", res);

    newVersionedList.version = res.version;
    setLinksListWithVersion(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values");
    setLinksListWithVersion(JSON.parse(oldValues));
  }
}

export async function addItem(monday, key, versionedLinks, setVersionedLinks, isCreatingANewLink ,setNewLinkCreatingState) {
    if (isCreatingANewLink) return;
    if (versionedLinks.list.length > 500) return;
    setNewLinkCreatingState(true);

  const oldValues = JSON.stringify(versionedLinks);
  try {
    if(!versionedLinks.list) versionedLinks.list = [];
    const newList = [...versionedLinks.list, ['', '']];

    const newVersionedList = {
      list: newList,
      version: versionedLinks.version,
    };

    await setItemForKey(
      monday,
      key,
      JSON.stringify(newList),
      versionedLinks.version
    );

    const res = await getItemForKey(monday, key);
    console.log("Added item response", res);

    newVersionedList.version = res.version;
    setVersionedLinks(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values due to error");
    setVersionedLinks(JSON.parse(oldValues));
    
  }finally{
    setNewLinkCreatingState(false);
  }
}

export async function deleteItem(monday, key, index, versionedLinks, setVersionedLinks, setTableLoadingState) {
  setTableLoadingState(true);
  const oldValues = JSON.stringify(versionedLinks);
  try {
    // Clone the list and remove the item at the specified index
    const newList = [...versionedLinks.list];
    newList.splice(index, 1);

    const newVersionedList = {
      list: newList,
      version: versionedLinks.version,
    };

    // Persist the updated list
    await setItemForKey(
      monday,
      key,
      JSON.stringify(newList),
      versionedLinks.version
    );

    // Fetch the latest version info
    const res = await getItemForKey(monday, key);
    console.log("Deleted item response", res);

    newVersionedList.version = res.version;
    setVersionedLinks(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values due to error");
    setVersionedLinks(JSON.parse(oldValues));
  }
  finally{
    setTableLoadingState(false);
  }
}