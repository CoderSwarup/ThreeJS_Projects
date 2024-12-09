import { useMultiplayerState } from "playroomkit";
import Lobby from "./Lobby";
import Game from "./Game";

export const Experience = () => {
  const [gameState] = useMultiplayerState("gameState", "lobby");
  return (
    <>
      {gameState === "lobby" && <Lobby />}
      {gameState === "game" && <Game />}
    </>
  );
};
