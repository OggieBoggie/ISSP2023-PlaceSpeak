"use client";
import { useState } from "react";
import { SocketType } from "../types/socket";
import { useSession } from "next-auth/react";

const CreatePoll = ({ socket }: { socket: SocketType }) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    const payload = {
      title: title,
      created_by: session?.user?.email ?? "Unknown",
    };

    const response = await fetch("http://127.0.0.1:8000/myapp/api/polls/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setTitle("");

      if (socket) {
        socket.emit("createPoll");
      }
    }
  };

  if (session && session.user) {
    return (
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Poll Title"
        />
        <button onClick={handleSubmit}>Create Poll</button>
      </div>
    );
  }
};

export default CreatePoll;
