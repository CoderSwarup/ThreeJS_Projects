import { useKeyboardControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import useGame from "../store/useGame";
import { addEffect } from "@react-three/fiber";

export default function Interface() {
  const timeRef = useRef();

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  const setControl = useGame((state) => state.setControl);

  const { phase } = useGame((state) => state);
  const restart = useGame((state) => state.restart);

  const handleButtonPress = (control, isPressed) => {
    setControl(control, isPressed);
  };

  useEffect(() => {
    const unsubcriberAddEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (timeRef.current) {
        timeRef.current.textContent = elapsedTime;
      }
    });

    return () => {
      unsubcriberAddEffect();
    };
  }, []);

  return (
    <div className="interface">
      {/* Time */}
      <div className="time" ref={timeRef}>
        0.00
      </div>

      {/* Restrart */}
      {phase === "ended" ? (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      ) : null}

      {/* <div className="controls">
        <div className="row">
          <div className={`key ${forward ? "key-active" : ""}`}>W</div>
        </div>
        <div className="row">
          <div className={`key ${leftward ? "key-active" : ""}`}>A</div>
          <div className={`key ${backward ? "key-active" : ""}`}>S</div>
          <div className={`key ${rightward ? "key-active" : ""}`}>D</div>
        </div>
        <div className="row">
          <div className={`key key-large ${jump && "key-active"}`}>SPACE</div>
        </div>
      </div> */}

      <div className="controls">
        <div className="row">
          <div
            className={`key ${forward ? "key-active" : ""}`}
            onTouchStart={() => handleButtonPress("forward", true)}
            onTouchEnd={() => handleButtonPress("forward", false)}
          >
            W
          </div>
        </div>
        <div className="row">
          <div
            className={`key ${leftward ? "key-active" : ""}`}
            onTouchStart={() => handleButtonPress("leftward", true)}
            onTouchEnd={() => handleButtonPress("leftward", false)}
          >
            A
          </div>
          <div
            className={`key ${backward ? "key-active" : ""}`}
            onTouchStart={() => handleButtonPress("backward", true)}
            onTouchEnd={() => handleButtonPress("backward", false)}
          >
            S
          </div>
          <div
            className={`key ${rightward ? "key-active" : ""}`}
            onTouchStart={() => handleButtonPress("rightward", true)}
            onTouchEnd={() => handleButtonPress("rightward", false)}
          >
            D
          </div>
        </div>
        <div className="row">
          <div
            className={`key key-large ${jump ? "key-active" : ""}`}
            onTouchStart={() => handleButtonPress("jump", true)}
            onTouchEnd={() => handleButtonPress("jump", false)}
          >
            SPACE
          </div>
        </div>
      </div>
    </div>
  );
}
