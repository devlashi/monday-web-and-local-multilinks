import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
//Explore more Monday React Components here: https://vibe.monday.com/
import { getDogColumnLongTextValue, addItem, deleteItem , getItemForKey, openLink , updateDescription, updateUrl} from "./js/AppCode";
import { ThemeProvider, Box, Button ,IconButton, Table, TableHeader, TableBody, TableHeaderCell, TableCell 
  , TableRow, EditableText, Icon, ButtonGroup, 
  AlertBanner, AlertBannerText , AlertBannerLink, Tooltip} from "@vibe/core";
import { UrlOpenEventStateAlers } from "./components/UrlOpenEventStateAlers";
import { Passcode } from "./components/Passcode";
import { FileExplorer } from "./components/FileExplorer";



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
          style={{width: "auto"}}
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
              width:180
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
              linkListWithVersion.list?.map(([description, url],index)=>(
                <TableRow className="cursor-pointer" key={index} >
                  <TableCell>
                    <EditableText
                      onChange={(newValue) => {
                        updateUrl(monday, context.itemId,index,linkListWithVersion,newValue,setLinkListWithVersion);
                        // You can also do something with newValue here
                      }}
                      type="text2"
                      value={url}
                      placeholder="Web or Local URL"
                      autoSelectTextOnEditMode={true}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableText
                      onChange={(newValue) => {
                        updateDescription(monday, context.itemId,index,linkListWithVersion,newValue,setLinkListWithVersion);
                        // You can also do something with newValue here
                      }}
                      type="text2"
                      value={linkListWithVersion.list[index][0]}
                      placeholder="ex: Google sheet, Images folder"
                      autoSelectTextOnEditMode={true}
                    />
                  </TableCell>
                  <TableCell >
                    <Button 
                      rightIcon={"Delete"} 
                      onClick={()=>openLink(url,setNotConnectedBannerState,setOpenUrlResponse)} 
                      size="small" 
                      color="positive" 
                      style={{height: "30px"}}
                      disabled={!url || url.trim() === ""}
                    >
                      Open URL
                    </Button>
                    <Button onClick={()=>deleteItem(monday,context.itemId,index,linkListWithVersion,setLinkListWithVersion, setTableLoadingState)} 
                    size="small"  
                    color="negative" 
                    style={{height: "30px",marginLeft:"30px",width:"30px"}} 
                    >
                      <Icon
                         iconType="src"
                         icon='/svgs/trash.svg'
                      />
                    </Button>
                  </TableCell>
    
                </TableRow>
              ))
            }
            
          </TableBody>
          
        </Table>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:'center'}}>
            <IconButton loading={isCreatingANewLink} kind="secondary" ariaLabel="Add a new link" onClick={()=>{addItem(monday,context.itemId,linkListWithVersion,setLinkListWithVersion, isCreatingANewLink ,setNewLinkCreatingState)}} />
            <Passcode openUrlResponse={openUrlRespons} setOpenUrlResponse={setOpenUrlResponse} />
        </div>
      </Box>
      {activeNotConnectedBanner && 
        <AlertBanner backgroundColor="negative" onClose={()=>setNotConnectedBannerState(false)}>
                      <AlertBannerText text="The Desktop app is not running!" />
          <AlertBannerLink
            href="https://monday.com"
            text="learn more"
          />
        </AlertBanner>
      }
      <UrlOpenEventStateAlers statusNumber={openUrlRespons} setStatusNumber={setOpenUrlResponse} />
      <FileExplorer/>
    </ThemeProvider>
    </div>
  );
};

export default App;
