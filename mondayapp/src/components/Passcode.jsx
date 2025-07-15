import { Button, EditableText, Icon, Tooltip } from "@vibe/core";
import { useState, useEffect } from "react";
import { DesktopResposeStatus } from "../js/AppCode";

export const Passcode = (params)=>{
    const [token, setToken] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const savedCode = localStorage.getItem("token");
        if (savedCode) {
            setToken(savedCode);
        }
    }, []);

    useEffect(() => {
        if (params.openUrlResponse === DesktopResposeStatus.AccessDeniedForIncorrectCode 
          || params.openUrlResponse === DesktopResposeStatus.CodeNotFoundInLocalStorage) {
            setHasError(true);
        }
    }, [params.openUrlResponse]);

    const handleCodeChange = (newValue) => {
        setToken(newValue);
        setIsEditing(false);
        setHasError(false);
        localStorage.setItem("token", newValue?.trim());
    };

    const hideInputFiled= (isEditing)=>{
      if(!isEditing){
        handleCodeChange(token);
      }
    }

    const handleDivClick = () => {
        setIsEditing(true);
    };

    return (
    <>
      {(token == null || isEditing) ? (
        <EditableText 
          placeholder="Passcode ....." 
          onChange={handleCodeChange}
          value={token}
          autoSelectTextOnEditMode={true}
          onEditModeChange={(isEditing)=>hideInputFiled(isEditing)}
        />
      ) : (
        <div
          style={{
            color: hasError ? "red" : "green",
            padding: "10px 20px",
            cursor: "pointer"
          }}
          onClick={handleDivClick}
        >
          <Icon iconType="src" icon="/svgs/key.svg" />
        </div>
      )}
    </>
);
}