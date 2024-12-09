import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";

export default function Lights() {
  const directLightRef = useRef();
  const { scene } = useThree();

  useFrame((state, delta) => {
    directLightRef.current.position.z = state.camera.position.z + 1;

    //
    directLightRef.current.target.position.z = state.camera.position.z;

    directLightRef.current.target.updateWorldMatrix();
  });

  // useEffect(() => {
  //   /**
  //    * Following is use to the By Default Is the following Properties Are Not In the Scene So we Cant Update This Directly using The useFrame So we Need to the Add that in the Scene
  //    * Alternet to use the target.updateMatrixWorld() in the UseFrame
  //    */
  //   scene.add(directLightRef.current.target);
  // }, [directLightRef]);
  return (
    <>
      <directionalLight
        ref={directLightRef}
        castShadow
        position={[4, 4, 1]}
        intensity={4}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={10}
        shadow-camera-near={1}
        shadow-camera-right={10}
        shadow-camera-left={-10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={1} />
    </>
  );
}
