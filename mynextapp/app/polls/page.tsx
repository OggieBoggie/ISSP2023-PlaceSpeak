"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import CreatePoll from "../components/CreatePoll";
import LatestPolls from "../components/LatestPolls";
import { SocketType } from "../types/socket";

const MainComponent = () => {
  const [socket, setSocket] = useState<SocketType>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000/polls");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div
      className="bg-gray-100 flex flex-col min-h-screen"
      style={{ minHeight: "calc(100vh - 3.25rem)" }}
    >
      <div className="flex flex-col md:flex-row md:flex-grow">
        <div className="w-full md:w-1/2 p-4 mt-4 md:mt-2">
          {socket ? <CreatePoll socket={socket} /> : null}
        </div>
        <div className="w-full mx-auto md:w-1/2 p-4 md:mt-12 max-w-2xl">
          {socket ? <LatestPolls socket={socket} /> : null}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
