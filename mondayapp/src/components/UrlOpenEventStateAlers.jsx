import { AlertBanner, AlertBannerText, AlertBannerLink, EditableText } from "@vibe/core";
import { DesktopResposeStatus } from "../js/AppCode";
export const UrlOpenEventStateAlers = (props)=>{

    const webLink = "https://www.seehasoft.com/monday-apps/super-links#troubleshooting";
    return (
        <div>        
            {props.statusNumber === 3 && 
                <AlertBanner backgroundColor="negative" onClose={()=>props.setStatusNumber(0)}>
                    <AlertBannerText 
                        style={{fontSize: "10px"}}
                        text="Please update the passcode with the code shown in the desktop app"
                    />
                    <AlertBannerLink
                        href={webLink}
                        text="learn more"
                    />
                </AlertBanner>
            }
            {props.statusNumber === 5 && 
                <AlertBanner backgroundColor="negative" onClose={()=>props.setStatusNumber(0)}>
                    <AlertBannerText text="Passcode has to be set to open local links!" />
                    <AlertBannerLink
                        href={webLink}
                        text="learn more"
                    />
                </AlertBanner>
            }
            {props.statusNumber === 6 && 
                <AlertBanner backgroundColor="negative" onClose={()=>props.setStatusNumber(0)}>
                    <AlertBannerText text="File or folder not found"/>
                    <AlertBannerLink
                        href={webLink}
                        text="learn more"
                    />
                </AlertBanner>
            }
            {props.statusNumber === DesktopResposeStatus.DesktopAppNotRunning && 
                <AlertBanner backgroundColor="negative" onClose={()=>props.setStatusNumber(0)}>
                <AlertBannerText text="The Desktop app is not running!" />
                <AlertBannerLink
                    href={webLink}
                    text="learn more"
                />
                </AlertBanner>
            }
        </div>
        
    );
}