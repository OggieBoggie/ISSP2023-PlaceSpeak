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

  return <div>{socket ? <LatestPolls socket={socket} /> : null}</div>;
};

export default MainComponent;
