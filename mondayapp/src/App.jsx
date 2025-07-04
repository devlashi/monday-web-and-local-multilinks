import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
//Explore more Monday React Components here: https://vibe.monday.com/
import { addItem, deleteItem , getItemForKey, openLink , parseWebUrl, updateDescription, updateUrl} from "./js/AppCode";
import { ThemeProvider, Box, Button ,IconButton, Table, TableHeader, TableBody, TableHeaderCell, TableCell 
  , TableRow, EditableText, Icon, ButtonGroup, 
  AlertBanner, AlertBannerText , AlertBannerLink, Tooltip} from "@vibe/core";
import { UrlOpenEventStateAlers } from "./components/UrlOpenEventStateAlers";
import { Passcode } from "./components/Passcode";
import { FileExplorer } from "./components/FileExplorer";
import { Url } from "./components/Url";



// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
export const monday = mondaySdk();
let itemId;
let boardId;
const  SubIcon = "calendar";

const App = () => {
  const [context, setContext] = useState(null);
  const [textData, setTextData] = useState(null);
  const [linkListWithVersion, setLinkListWithVersion] = useState({list:[],version:0});
  const [activeNotConnectedBanner, setNotConnectedBannerState] = useState(false);
  const [isCreatingANewLink, setNewLinkCreatingState] = useState(false);
  const [isTableLoading, setTableLoadingState] = useState(true)
  const [openUrlRespons, setOpenUrlResponse] = useState(0);

useEffect(() => {
  monday.execute("valueCreatedForUser");

  // Define a separate async function
  const handleContext = async (ctx) => {
    setContext(ctx);

      if (ctx?.itemId && ctx?.boardId) {
          console.info(ctx);
      try {
        const result = await getItemForKey(monday, ctx.itemId);
        setTextData(result);
        
        const list = JSON.parse(result.value);
        setLinkListWithVersion({
          list: list,
          version: result.version
        });
      } catch (err) {
        console.error("Error fetching column text:", err);
      }
    }
    setTableLoadingState(false);
  };

  // Use a normal (non-async) callback for listen
  monday.listen("context", (res) => {
    const ctx = res.data;
    handleContext(ctx); // call async function safely
  });

}, []);

  itemId = context?.itemId;
  boardId = context?.boardId;
  

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }.
  Let's start building your amazing app, You can do it. The connected item ${itemId}`;

  

  return (
    <div className="App">
      
      <ThemeProvider
        themeConfig={context?.themeConfig} systemTheme={context?.theme}
      >
      <Box padding="medium">
        <Table 
          style={{width: "auto", position: "relative"}}
          size="medium"
          columns={[
            {
              id:'url',
              title: 'url'
            },
            {
              id:'description',
              title:'description',
              
            },
            {
              id:'open-btn',
              title:"",
              width:290
            }
          ]}
          dataState={{ isLoading: isTableLoading}}
        >
          <TableHeader>
            <TableHeaderCell title="URL" />
            <TableHeaderCell title="Description" />
            <TableHeaderCell title="" />
          </TableHeader>
          <TableBody>
            { 
              linkListWithVersion.list?.map(([description, url], index) => (
                <Url
                  key={index}
                  url={url}
                  description={description}
                  index={index}
                  monday={monday}
                  context={context}
                  linkListWithVersion={linkListWithVersion}
                  setLinkListWithVersion={setLinkListWithVersion}
                  setNotConnectedBannerState={setNotConnectedBannerState}
                  setOpenUrlResponse={setOpenUrlResponse}
                  setTableLoadingState={setTableLoadingState}
                />
              ))
            }
          </TableBody>
          
        </Table>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:'center'}}>
            <IconButton loading={isCreatingANewLink} kind="secondary" ariaLabel="Add a new link" onClick={()=>{addItem(monday,context.itemId,linkListWithVersion,setLinkListWithVersion, isCreatingANewLink ,setNewLinkCreatingState)}} />
            <Tooltip 
            content="Use the passcode displayed in your desktop app. Each user must set it individually in their browser to open local URLs. It’s unique to your device and not shared with others." 
            position="left" 
            showDelay={800}>
              <Passcode openUrlResponse={openUrlRespons} setOpenUrlResponse={setOpenUrlResponse} />
            </Tooltip>
        </div>
      </Box>
      {/* {activeNotConnectedBanner && 
        
      } */}
      <UrlOpenEventStateAlers statusNumber={openUrlRespons} setStatusNumber={setOpenUrlResponse} />
    </ThemeProvider>
    </div>
  );
};

export default App;
