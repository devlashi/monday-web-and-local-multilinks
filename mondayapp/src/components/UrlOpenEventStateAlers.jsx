import { AlertBanner, AlertBannerText, AlertBannerLink, EditableText } from "@vibe/core";
export const UrlOpenEventStateAlers = (props)=>{

    return (
        <div>        
            {props.statusNumber === 3 && 
                <AlertBanner backgroundColor="negative" onClose={()=>props.setStatusNumber(0)}>
                            <AlertBannerText 
                            style={{fontSize: "10px"}}
                            text="Please update the passcode with the code shown in the desktop app"
                            />
                            <AlertBannerLink 
                            text="Click for instructions" 
                            href="https://google.com"/>
                </AlertBanner>
            }
            {props.statusNumber === 5 && 
                <AlertBanner backgroundColor="negative" onClose={()=>props.setStatusNumber(0)}>
                            <AlertBannerText 
                            text="Passcode has to be set to open local links!" />
                </AlertBanner>
            }
        </div>
        
    );
}