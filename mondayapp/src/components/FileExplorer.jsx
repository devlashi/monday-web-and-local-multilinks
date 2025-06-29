import { Box, Table, TableBody, TableRow, TableCell, Icon ,Text} from "@vibe/core"
import { useEffect, useState } from "react"

export const FileExplorer = ()=>{

    const [folder, setFolder] = useState({Files:[],Folders:[]});

    useEffect(()=>{
        const fetchFolder = async ()=>{
            const response = await fetch("http://localhost:3000/api/v1/folder");
            const data = await response.json();
            setFolder(data);
        }

    })

    return (
        <Box padding="medium">
            <Text type="text3">
                Local file system
            </Text>
            
            <Table
                style={{width: "auto"}}
                size="medium"
                columns={[
                {
                    id:'url',
                    title: 'url',
                    width:50
                },
                {
                    id:'description',
                    title:'description',
                    
                },
                {
                    id:'open-btn',
                    title:"",
                    width:100
                }
                ]}
                dataState={{ isLoading: false}}
            >
                <TableBody>
                    {folder.Folders.map((folderItem, index) => {
                        <TableRow>
                        <TableCell>
                            <Icon iconType="folder" />
                            {folder.name}
                        </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </Box>
    )
}