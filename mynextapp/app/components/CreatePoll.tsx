"use client";
import { useState } from "react";
import { SocketType } from "../types/socket";
import { useSession } from "next-auth/react";

import Popup from "./Popup";
import Confetti from './Confetti';

const CreatePoll = ({ socket }: { socket: SocketType }) => {
  const { data: session } = useSession();
  const [showConfetti, setShowConfetti] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
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

    const createPollResponse = await fetch("http://127.0.0.1:8000/myapp/api/polls/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (createPollResponse.ok) {
      setPollData({ title: "", description: "", choices: [{ text: "" }] });
      if (socket) {
        socket.emit("createPoll");
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      if (session?.user?.email) {
        const awardPointsResponse = await fetch(`http://127.0.0.1:8000/myapp/api/award-points/${session?.user?.email}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ points: 1 }),
        });

        if (!awardPointsResponse.ok) {
          console.error("Failed to award points");
        } else {
          setPopupMessage(`Thank you for submitting the poll! You have earned ${1} point.`);
          setShowPopup(true);
        }
      }
    } else {
      console.error("Failed to create poll");
    }
  };

  if (session && session.user) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-black mb-8">
          Create a New Poll
        </h2>
        <div className="mb-4">
          <input
            type="text"
            value={pollData.title}
            onChange={handleTitleChange}
            placeholder="Poll Title"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition-colors text-black"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={pollData.description}
            onChange={handleDescriptionChange}
            placeholder="Poll Description"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition-colors text-black"
          />
        </div>
        <div className="mb-4">
          <label className="text-black font-semibold">Choices:</label>
          {pollData.choices.map((choice, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, e)}
                placeholder={`Choice #${index + 1}`}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition-colors text-black"
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
            className="bg-indigo-500 text-black px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 shadow-lg"
          >
            Create Poll
          </button>
        </div>
        <Popup
          message={popupMessage}
          show={showPopup}
          duration={3000}
          hide={() => setShowPopup(false)}
        />
        {showConfetti && <Confetti />}
      </div>
    );

  }
  return null;
};

export default CreatePoll;
