import React from "react";
import Lights from "./Lights";
import Level from "./Level";
import { Physics, Debug } from "@react-three/rapier";
import Player from "./Player";
import useGame from "../store/useGame";
import Effects from "./Effects";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blockSeed = useGame((state) => state.blockSeed);

  return (
    <>
      <color args={["#bdedfc"]} attach={"background"} />
      <Physics>
        {/* <Debug /> */}
        <Lights />
        <Level count={blocksCount} seed={blockSeed} />
        <Player />
      </Physics>

      <Effects />
    </>
  );
}
