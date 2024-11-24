import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Html, Scroll, ScrollControls } from "@react-three/drei";
import Experience from "./components/Experience";
import UI from "./components/UI";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
            <h1 className="text-white">Loading</h1>
          </div>
        }
      >
        <Canvas shadows camera={{ position: [0, 1, 8], fov: 30 }}>
          <color attach="background" args={["#151515"]} />
          <fog attach={"fog"} color={"#0f0f0f"} />

          <ScrollControls pages={4}>
            <Scroll>
              <Experience />
            </Scroll>
            <Scroll html>
              <UI />
            </Scroll>
          </ScrollControls>

          <EffectComposer>
            <Bloom mipmapBlur />
          </EffectComposer>
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
