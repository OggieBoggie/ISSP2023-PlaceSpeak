"use client";
import { useState, useEffect } from "react";
import { SocketType } from "../types/socket";
import { Poll } from "../types/polls";

const LatestPolls = ({ socket }: { socket: SocketType }) => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    // Fetch latest polls initially
    const fetchPolls = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/myapp/api/polls/?limit=2"
      );
      const data = await response.json();
      setPolls(data);
    };

    fetchPolls();

    // Listen for any new polls
    if (socket) {
      socket.on("newPoll", fetchPolls);
      return () => {
        socket.off("newPoll", fetchPolls);
      };
    }
  }, [socket]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="font-bold text-xl text-gray-700 mb-4">Latest Polls</h2>
      {polls.map((poll) => (
        <div key={poll.id} className="mb-2">
          {poll.created_by.slice(0, 3) + "***" + poll.created_by.slice(-4)}{" "}
          created a poll: {poll.title} at{" "}
          {new Date(poll.created_at).toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default LatestPolls;
