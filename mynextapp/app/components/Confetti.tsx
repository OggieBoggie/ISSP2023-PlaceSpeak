import { useCallback, useEffect, useRef, FunctionComponent } from "react";
import ReactCanvasConfetti from "react-canvas-confetti"; // Assuming IConfetti is the type for the instance
import { IConfetti } from "../types/confetti";

const Confetti: FunctionComponent = () => {
  // Use the IConfetti type for the ref instance (assuming such a type exists)
  const refAnimationInstance = useRef<IConfetti | null>(null);

  const getInstance = useCallback((instance: IConfetti | null) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback(
    (particleRatio: number, opts: Record<string, any>) => {
      refAnimationInstance.current?.({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
    },
    []
  );

  useEffect(() => {
    fire();
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  return (
    <ReactCanvasConfetti
      refConfetti={getInstance}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Confetti;
