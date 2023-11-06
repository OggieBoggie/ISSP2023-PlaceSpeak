"use client";
import { useState } from "react";
import { SocketType } from "../types/socket";
import { useSession } from "next-auth/react";

const CreatePoll = ({ socket }: { socket: SocketType }) => {
  const { data: session } = useSession();
  const [pollData, setPollData] = useState({
    title: "",
    description: "",
    choices: [{ text: "" }],
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPollData({ ...pollData, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPollData({ ...pollData, description: e.target.value });
  };

  const handleChoiceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newChoices = pollData.choices.map((choice, choiceIndex) => {
      if (index !== choiceIndex) return choice;
      return { ...choice, text: e.target.value };
    });
    setPollData({ ...pollData, choices: newChoices });
  };

  const handleAddChoice = () => {
    setPollData({ ...pollData, choices: [...pollData.choices, { text: "" }] });
  };

  const handleRemoveChoice = (index: number) => {
    setPollData({
      ...pollData,
      choices: pollData.choices.filter(
        (_, choiceIndex) => index !== choiceIndex
      ),
    });
  };

  const handleSubmit = async () => {
    const payload = {
      ...pollData,
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
      setPollData({ title: "", description: "", choices: [{ text: "" }] });
      if (socket) {
        socket.emit("createPoll");
      }
    }
  };

  if (session && session.user) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Create a New Poll
        </h2>
        <div className="mb-4">
          <input
            type="text"
            value={pollData.title}
            onChange={handleTitleChange}
            placeholder="Poll Title"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={pollData.description}
            onChange={handleDescriptionChange}
            placeholder="Poll Description"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Choices:</label>
          {pollData.choices.map((choice, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, e)}
                placeholder={`Choice #${index + 1}`}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {pollData.choices.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveChoice(index)}
                  className="ml-2 bg-red-500 text-white px-3 py-1 rounded shadow"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddChoice}
            className="mt-3 bg-green-500 text-white px-3 py-1 rounded shadow"
          >
            Add Choice
          </button>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 shadow-lg"
          >
            Create Poll
          </button>
        </div>
      </div>
    );
  }
  return null;
};

export default CreatePoll;
