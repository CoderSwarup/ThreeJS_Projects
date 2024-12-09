import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Experience from "./components/Experience";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./components/Interface";

function App() {
  return (
    <>
      <KeyboardControls
        map={[
          {
            name: "forward",
            keys: ["ArrowUp", "KeyW"],
          },
          {
            name: "backward",
            keys: ["ArrowDown", "KeyS"],
          },
          {
            name: "leftward",
            keys: ["ArrowLeft", "KeyA"],
          },
          {
            name: "rightward",
            keys: ["ArrowRight", "KeyD"],
          },
          {
            name: "jump",
            keys: ["Space"],
          },
          { name: "rotateLeft", keys: ["KeyQ"] },
          { name: "rotateRight", keys: ["KeyE"] },
        ]}
      >
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.NeutralToneMapping,
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [3, 2, 6],
          }}
          shadows
        >
          <Experience />
        </Canvas>

        <Interface />
      </KeyboardControls>
    </>
  );
}

export default App;
