import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
const useGame = create(
  subscribeWithSelector((set, get) => ({
    blocksCount: 3,
    blockSeed: 0,

    //Time
    startTime: 0,
    endTime: 0,

    // Phases
    phase: "ready",
    start: () => {
      return set((state) => {
        if (state.phase === "ready")
          return { phase: "playing", startTime: Date.now() };

        return {};
      });
    },
    restart: () => {
      return set((state) => {
        if (
          state.phase === "ready" ||
          state.phase === "playing" ||
          state.phase === "ended"
        )
          return { phase: "ready", blockSeed: Math.random() };

        return {};
      });
    },
    end: () => {
      return set((state) => {
        if (state.phase === "playing")
          return { phase: "ended", endTime: Date.now() };

        return {};
      });
    },

    // Click Events
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    jump: false,
    setControl: (control, value) =>
      set((state) => ({
        ...state,
        [control]: value,
      })),
  }))
);

export default useGame;
