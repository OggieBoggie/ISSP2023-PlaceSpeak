"use client";

import { useState } from "react";
import Confetti from "../components/Confetti";

export default function ConfettiLayout() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible(true)}>Fire</button>
      {isVisible && <Confetti />}
    </>
  );
}
