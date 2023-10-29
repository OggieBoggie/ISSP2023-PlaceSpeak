import { useState, useEffect } from "react";
import { SocketType } from "../types/socket";
import { Poll } from "../types/polls";
import { Transition } from "@headlessui/react";

const LatestPolls = ({ socket }: { socket: SocketType }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPolls, setNewPolls] = useState<Poll[]>([]);

  const fetchPolls = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/myapp/api/polls/?limit=2"
    );
    const latestData = await response.json();

    // If the polls are empty
    if (polls.length === 0) {
      setNewPolls(latestData); // Highlight both polls
      setPolls(latestData); // Set the fetched polls directly
    }
    // If there's at least one poll and the top fetched poll is different from the top poll in current list
    else if (polls[0].id !== latestData[0].id) {
      // Set the new poll for highlighting
      setNewPolls([latestData[0]]);

      // Modify polls to have the new poll and the previous top poll only
      setPolls([latestData[0], polls[0]]);
    } else {
      // Reset new polls if no new poll is detected
      setNewPolls([]);
    }
  };

  useEffect(() => {
    fetchPolls();

    if (socket) {
      socket.on("newPoll", fetchPolls);
      return () => {
        socket.off("newPoll", fetchPolls);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (newPolls.length > 0) {
      const timeout = setTimeout(() => {
        setNewPolls([]);
      }, 3000); // highlight for 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [newPolls]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
      <h2 className="font-bold text-2xl text-gray-800 mb-2">Latest Polls</h2>
      <div className="space-y-2">
        {polls.map((poll) => (
          <Transition
            as="div"
            key={poll.id}
            show={true}
            enter="transition-opacity ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <div
              className={`bg-blue-100 p-3 rounded-md shadow hover:shadow-lg transition-shadow ${
                newPolls.some((p) => p.id === poll.id)
                  ? "border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <span className="block text-blue-600 font-semibold">
                {poll.created_by.slice(0, 3) +
                  "***" +
                  poll.created_by.slice(-4)}{" "}
                created a poll:
              </span>
              <span className="block text-gray-700 mt-1">{poll.title}</span>
              <span className="block text-sm text-gray-500 mt-2">
                {new Date(poll.created_at).toLocaleString()}
              </span>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
};

export default LatestPolls;
