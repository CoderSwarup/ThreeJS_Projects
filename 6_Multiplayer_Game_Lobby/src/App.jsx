import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { UI } from "./components/UI";
function App() {
  return (
    <>
      <UI />
      <Canvas shadows camera={{ position: [4.2, 1.5, 6.5], fov: 55 }}>
        <color attach="background" args={["#000"]} />
        <Experience />
        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
