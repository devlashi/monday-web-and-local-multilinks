import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
//Explore more Monday React Components here: https://vibe.monday.com/
import { addItem,refreshTable, deleteItem , getItemForKey, openLink , parseWebUrl, updateDescription, updateUrl} from "./js/AppCode";
import { ThemeProvider, Box, Button ,IconButton, Table, TableHeader, TableBody, TableHeaderCell, TableCell 
  , TableRow, EditableText, Icon, ButtonGroup, 
  AlertBanner, AlertBannerText , AlertBannerLink, Tooltip} from "@vibe/core";
import { UrlOpenEventStateAlers } from "./components/UrlOpenEventStateAlers";
import { Passcode } from "./components/Passcode";
import { FileExplorer } from "./components/FileExplorer";
import { Url } from "./components/Url";
import { DoubleCheck, Add, Rotate } from "@vibe/icons";

console.log("doublecheck",DoubleCheck);

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
export const monday = mondaySdk();
let itemId;
let boardId;

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

  useEffect(() => {
    if (isCreatingANewLink === false && linkListWithVersion.list.length > 0 && !isTableLoading) {
      // This will only run when isCreatingANewLink changes from true to false
      // which happens after a new item is successfully added
      setTimeout(() => {
        const scrollTarget = document.getElementById('scroll-target');
        if (scrollTarget) {
          scrollTarget.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }
      }, 100);
    }
  }, [isCreatingANewLink]); // Only depend on the creating state

  itemId = context?.itemId;
  boardId = context?.boardId;
  
  return (
    <div className="App">
      
      <ThemeProvider
        themeConfig={context?.themeConfig} systemTheme={context?.theme}
      >
        <div className="menu-container">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:'center'}}>
              <div style={{ display: "flex", gap: "8px" }}>
                <IconButton 
                  icon={Add}
                  loading={isCreatingANewLink} 
                  kind="secondary" 
                  ariaLabel="Add a new link" 
                  onClick={()=>{addItem(monday,context.itemId,linkListWithVersion,setLinkListWithVersion, isCreatingANewLink ,setNewLinkCreatingState)}} 
                  disabled={context?.user?.isViewOnly}
                />
                <IconButton
                  icon={Rotate}
                  kind="secondary" 
                  ariaLabel="Refresh data"
                  onClick={()=>{refreshTable(monday,context.itemId,linkListWithVersion,setLinkListWithVersion, isCreatingANewLink ,setNewLinkCreatingState,setTableLoadingState)}} 
                />
              </div>
                
                <Tooltip 
                  content="Use the access token displayed in your desktop app. 
                  Each user must set it individually in their browser to open local URLs.
                  It’s unique to your device and not shared with others.
                  This is only required if you need to open local files or folders.
                  " 
                  position="left" 
                  zIndex={2}
                  showDelay={800}>
                  <Passcode openUrlResponse={openUrlRespons} setOpenUrlResponse={setOpenUrlResponse} />
                </Tooltip>
            </div>
            <UrlOpenEventStateAlers statusNumber={openUrlRespons} setStatusNumber={setOpenUrlResponse} />
        </div>
      <Box className="table-container">
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
              title: 'description',
              width: 210
              
            },
            {
              id:'open-btn',
              title:"",
              width:200
            }
          ]}
          dataState={{ isLoading: isTableLoading}}
        >
          <TableHeader className="table-header-fix">
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
      </Box>
      <div id="scroll-target" ></div>
    </ThemeProvider>
    </div>
  );
};

export default App;
