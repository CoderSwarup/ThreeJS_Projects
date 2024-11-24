import "./App.css";
import Experience from "./component/Experience";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Interface from "./component/Interface";

function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [0, 2, 3],
        }}
      >
        <color args={["#00ca5b"]} attach={"background"} />
        <OrbitControls
          maxDistance={4}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 8}
        />
        <ambientLight intensity={5} />

        <Experience />
      </Canvas>
      <Interface />
    </>
  );
}

export default App;
