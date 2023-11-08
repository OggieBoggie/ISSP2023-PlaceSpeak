"use client";
import { useEffect } from "react";

type PopupProps = {
    message: string;
    show: boolean;
    duration: number;
    hide: () => void; 
  };
  

const Popup: React.FC<PopupProps> = ({ message, show, duration, hide }) => {
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      if (show) {
        timeoutId = setTimeout(() => {
          hide();
        }, duration);
      }
      return () => clearTimeout(timeoutId);
    }, [show, duration, hide]);
  
    return show ? (
      <div className="fixed mb-4 bottom-0 left-1/4 w-1/2 bg-green-500 text-white text-center p-4 z-50">
        {message}
      </div>
    ) : null;
  };

  export default Popup;