import { TableCell, TableRow, EditableText, Button, Icon, Tooltip } from "@vibe/core";
import { updateUrl, updateDescription, openLink, deleteItem, parseWebUrl } from "../js/AppCode";

export const Url = ({ 
  url, 
  description, 
  index, 
  monday, 
  context, 
  linkListWithVersion, 
  setLinkListWithVersion, 
  setNotConnectedBannerState, 
  setOpenUrlResponse, 
  setTableLoadingState 
}) => {
  const isUrlEmpty = !url || url.trim() === "";
  const isWebUrl = parseWebUrl(url).isValid;
  const isOpenParentDisabled = isUrlEmpty || isWebUrl;
  const isOpenUrlDisabled = isUrlEmpty;

  const getOpenParentTooltip = () => {
    if (isUrlEmpty) return "Enter a URL first";
    if (isWebUrl) return "Only available for local paths";
    return "Open parent folder";
  };

  const getOpenUrlTooltip = () => {
    if (isUrlEmpty) return "Enter a URL first";
      return "Open in a new tab or local files/folders in File Explorer or their default apps.";
  };

  return (
    <TableRow className="cursor-pointer" key={index}>
      <TableCell>
        <EditableText
          onChange={(newValue) => {
            updateUrl(monday, context.itemId, index, linkListWithVersion, newValue, setLinkListWithVersion);
          }}
          type="text2"
          value={url}
          placeholder="Web or Local URL"
          autoSelectTextOnEditMode={true}
          readOnly={context.user.isViewOnly}
        />
      </TableCell>
      <TableCell>
        <EditableText
          onChange={(newValue) => {
            updateDescription(monday, context.itemId, index, linkListWithVersion, newValue, setLinkListWithVersion);
          }}
          type="text2"
          value={description}
          placeholder="ex: Google sheet, Images folder"
          autoSelectTextOnEditMode={true}
          readOnly={context.user.isViewOnly}
        />
      </TableCell>
      <TableCell>
        <Tooltip content={getOpenParentTooltip()} showDelay={500}>
          <Button 
            onClick={() => openLink(url, setNotConnectedBannerState, setOpenUrlResponse, true)} 
            size="small" 
            color="primary" 
            style={{ height: "30px", width: "50px" }} 
            disabled={isOpenParentDisabled}
          >
                      <Icon
                          iconType="src"
                          icon='/svgs/folder.svg'
                      />
          </Button>
        </Tooltip>
        <Tooltip content={getOpenUrlTooltip()} showDelay={500}>
            <Button 
            onClick={() => openLink(url, setNotConnectedBannerState, setOpenUrlResponse, false)} 
            size="small" 
            color="primary"
            style={{ height: "30px", marginLeft: "10px", width: "50px" }} 
            disabled={isOpenUrlDisabled}
            >
            <Icon
                iconType="src"
                icon='/svgs/open.svg'
            />
          </Button>
        </Tooltip>
        <Tooltip content="Delete this link" position="left" showDelay={500}>
            <Button 
            onClick={() => deleteItem(monday, context.itemId, index, linkListWithVersion, setLinkListWithVersion, setTableLoadingState)} 
            size="small"  
            color="negative" 
            style={{height: "30px", marginLeft: "30px", width: "30px"}} 
            disabled={context.user.isViewOnly}
            >
            <Icon
                iconType="src"
                icon='/svgs/trash.svg'
            />
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}; 