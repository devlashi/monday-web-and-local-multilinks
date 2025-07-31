import { AlertBanner, AlertBannerText, AlertBannerLink } from "@vibe/core";
import { DesktopResposeStatus } from "../js/AppCode";

export const UrlOpenEventStateAlers = (props) => {
    const webLink = "https://viskode.com/monday-apps/local-and-web-links#troubleshooting";

    // Map status codes to messages
    const messages = {
        [DesktopResposeStatus.AccessDeniedForIncorrectCode]: "Please update the Access token with the code shown in the desktop app.",
        [DesktopResposeStatus.CodeNotFoundInLocalStorage]: "Access token has to be set to open local links.",
        [DesktopResposeStatus.FileFolderNotFound]: "File or folder not found.",
        [DesktopResposeStatus.DesktopAppNotRunning]: "Connection to the Desktop Connector failed.",
        [DesktopResposeStatus.NotAuthorizedFileOrDirectory]: "Access restricted: the desktop app cannot open this folder or file type due to security settings.",
    };

    const message = messages[props.statusNumber];

    // If no message, render nothing
    if (!message) return null;

    // Conditionally add style for specific status
    const alertTextStyle = props.statusNumber === DesktopResposeStatus.AccessDeniedForIncorrectCode
        ? { fontSize: "10px" }
        : undefined;

    return (
        <AlertBanner backgroundColor="negative" onClose={() => props.setStatusNumber(0)}>
            <AlertBannerText style={alertTextStyle} text={message} />
            <AlertBannerLink href={webLink} text="learn more" />
        </AlertBanner>
    );
};
