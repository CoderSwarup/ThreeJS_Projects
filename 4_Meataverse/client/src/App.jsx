import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Environment, Html, ScrollControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { cameraPositionAtom, SocketManager } from "./components/SocketManager";
import { atom, useAtom } from "jotai";
import { UI } from "./components/UI";

const MAXCAMERA_ZOOM = 30;
const MINCAMERA_ZOOM = 8;

function App() {
  const [cameraPosition, setCameraPosition] = useAtom(cameraPositionAtom);

  return (
    <>
      {/* <button
        onClick={() => {
          setCameraPosition((prev) => {
            if (prev >= MAXCAMERA_ZOOM) {
              return MAXCAMERA_ZOOM;
            } else {
              return prev + 1;
            }
          });
        }}
      >
        Zoom Out
      </button>
      <button
        onClick={() => {
          setCameraPosition((prev) => {
            if (prev <= MINCAMERA_ZOOM) {
              return MINCAMERA_ZOOM;
            } else {
              return prev - 1;
            }
          });
        }}
      >
        Zoom In
      </button> */}
      <UI />
      <SocketManager />
      <Canvas
        shadows
        camera={{
          position: [cameraPosition, cameraPosition, cameraPosition],
          fov: 30,
        }}
      >
        <color attach="background" args={["#ececec"]} />

        <Suspense
          fallback={
            <Html>
              <h1>Loading</h1>
            </Html>
          }
        >
          <ScrollControls pages={4}>
            <Experience />
          </ScrollControls>
        </Suspense>

        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}

export default App;
