import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
import toast from "react-hot-toast";

export const DesktopResposeStatus = {
  "Default": 0,
  "Success": 1,
  "AccessDeniedForNonMondayContext": 2,
  "AccessDeniedForIncorrectCode": 3,
  "ServerError": 4,
  "CodeNotFoundInLocalStorage": 5,
  "FileFolderNotFound": 6,
  "DesktopAppNotRunning": 7
}


export function openLink(url,setNotConnetedBannerState, setOpenUrlResponse,openParentfolder){
  setNotConnetedBannerState(false);
  setOpenUrlResponse(0);
  if(url == null || url == "") return;

  let urlResult = parseWebUrl(url);

  if(urlResult.isValid){
    window.open(urlResult.url, '_blank');
    return;
  }

  let token = localStorage.getItem('token');
  if (token == null || token == ''){
    setOpenUrlResponse(DesktopResposeStatus.CodeNotFoundInLocalStorage);
    return;
  }

  const parts = token.split("-");
  const port = parts[parts.length - 1];
  const code = parts.slice(0, -1).join("-"); // Everything except the last part

  fetch(`http://localhost:${port}/api/open/${encodeURIComponent(url)}?openParentFolder=${openParentfolder}`, {
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
        if (data === DesktopResposeStatus.AccessDeniedForIncorrectCode) {
            setOpenUrlResponse(DesktopResposeStatus.AccessDeniedForIncorrectCode);
        }else if(data === DesktopResposeStatus.FileFolderNotFound){
            setOpenUrlResponse(DesktopResposeStatus.FileFolderNotFound);
        }
        // You can now use `data` as needed
    })
    .catch(error => {
        console.error('Fetch error:', error);
        setNotConnetedBannerState(true);
        setOpenUrlResponse(DesktopResposeStatus.DesktopAppNotRunning);
    });
}

export function parseWebUrl(str) {
  if (typeof str !== 'string') {
    return { isValid: false, url: null };
  }

  let input = str.trim();

  // If starts with www., prepend http://
  if (input.startsWith('www.')) {
    input = 'http://' + input;
  }

  try {
    const url = new URL(input);

    // Check if scheme is http or https
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return { isValid: true, url: url.href };
    }
    return { isValid: false, url: null };
  } catch (e) {
    return { isValid: false, url: null };
  }
}

export async function getItemForKey(monday,itemId){
  let key = `item-links-${itemId}`;
  const res = await monday.storage.getItem(key);
  console.log(res);
  return res.data;
}

export async function setItemForKey(monday, itemId,value ,previousVersion){
  let key = `item-links-${itemId}`;
  await monday.storage.setItem(key,value,{previous_version:previousVersion});
}

export async function updateDescription(
  monday,
  itemId,
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
      itemId,
      JSON.stringify(newList),
      linksListWithVersion.version
    );

    const res = await getItemForKey(monday, itemId);
    console.log("updated response", res);

    newVersionedList.version = res.version;
    newVersionedList.list = JSON.parse(res.value);
    console.log("new version", newVersionedList);
    
    setLinksListWithVersion(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values");
    setLinksListWithVersion(JSON.parse(oldValues));
  }
}

export async function updateUrl(
  monday,
  itemId,
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
    
    let updateResp = await setItemForKey(
      monday,
      itemId,
      JSON.stringify(newList),
      linksListWithVersion.version
    );

    const res = await getItemForKey(monday, itemId);
    console.log("updated response", res);

    newVersionedList.version = res.version;
    newVersionedList.list = JSON.parse(res.value);
    setLinksListWithVersion(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values");
    setLinksListWithVersion(JSON.parse(oldValues));
  }
}

export async function addItem(monday, itemId, versionedLinks, setVersionedLinks, isCreatingANewLink ,setNewLinkCreatingState) {
  
  if (isCreatingANewLink) return;
  if (  versionedLinks?.list?.length >= 500) return;
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
      itemId,
      JSON.stringify(newList),
      versionedLinks.version
    );

    const res = await getItemForKey(monday, itemId);
    console.log("Added item response", res);

    newVersionedList.version = res.version;
    newVersionedList.list = JSON.parse(res.value);
    setVersionedLinks(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values due to error");
    setVersionedLinks(JSON.parse(oldValues));
    
  }finally{
    setNewLinkCreatingState(false);
  }
}

export async function deleteItem(monday, itemId, index, versionedLinks, setVersionedLinks, setTableLoadingState) {
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
      itemId,
      JSON.stringify(newList),
      versionedLinks.version
    );

    // Fetch the latest version info
    const res = await getItemForKey(monday, itemId);
    console.log("Deleted item response", res);

    newVersionedList.version = res.version;
    newVersionedList.list = JSON.parse(res.value);
    setVersionedLinks(newVersionedList);
  } catch (e) {
    console.log("Reverting to old values due to error");
    setVersionedLinks(JSON.parse(oldValues));
  }
  finally{
    setTableLoadingState(false);
  }
}

export async function fetchFavorites() {
  let token = localStorage.getItem('token');
  if (token == null || token == ''){
    return DesktopResposeStatus.CodeNotFoundInLocalStorage;
  }
  
  const parts = token.split("-");
  const port = parts[parts.length - 1];
  const code = parts.slice(0, -1).join("-"); // Everything except the last part
  
  let url = `http://localhost:${port}/api/spec-folders`;

  const response = await fetch(url,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'bearer': code
      }
    }
  );
  const data = await response.json();
  return data;
}