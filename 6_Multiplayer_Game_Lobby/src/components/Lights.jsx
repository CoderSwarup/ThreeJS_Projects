import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

export default function Lights({ children, controls }) {
  const animatedLight = useRef();

  const shadowBias = -0.005;
  const shadowMapSize = 2048;

  useFrame(({ clock }) => {
    animatedLight.current.position.x =
      Math.sin(clock.getElapsedTime() * 0.5) * 2;

    controls.current.camera.position.x +=
      Math.cos(clock.getElapsedTime() * 0.5) * 0.25;
    controls.current.camera.position.y +=
      Math.sin(clock.getElapsedTime() * 1) * 0.125;
  });

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[6, 4, 6]} intensity={0.4} color="white" />
      <group scale={0.66}>
        {children}
        <group position={[5.5, 0.5, -1.2]}>
          <pointLight
            intensity={3}
            distance={15}
            decay={3}
            color="#4124c9" // blue
          />
          <Box scale={0.1} visible={false}>
            <meshBasicMaterial color="white" />
          </Box>
        </group>
        <group position={[-3, 3, -2]}>
          <pointLight
            intensity={13}
            decay={3}
            distance={6}
            color="#a5adff" // purple
          />
          <Box scale={0.1} visible={false}>
            <meshBasicMaterial color="white" />
          </Box>
        </group>

        <group position={[0, 2.5, 0.5]} ref={animatedLight}>
          <pointLight
            intensity={2}
            decay={2}
            distance={10}
            castShadow
            color="#f7d216" // Orange
            shadow-bias={shadowBias}
            shadow-mapSize-width={shadowMapSize}
            shadow-mapSize-height={shadowMapSize}
          />
          <Box scale={0.1} visible={false}>
            <meshBasicMaterial color="white" />
          </Box>
        </group>
      </group>
    </>
  );
}
