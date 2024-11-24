import { CameraControls, Center, OrbitControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { Model } from "../Model";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import PointLightWithMesh from "../PointLightWithMesh";
export default function HomeExperience() {
  const pointLightRef = useRef();
  const modelRef = useRef();

  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  const radius = 1; // Define the radius for the lights
  useFrame(() => {
    const handlePointLightMove = (e) => {
      // Get the screen width and height
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Normalize clientX and clientY to a range between 0 and 4
      const normalizedX = (e.clientX / screenWidth) * 4; // Scale X to be between 0 and 4
      const normalizedY = 1 - (e.clientY / screenHeight) * 4; // Scale Y to be between 0 and 4

      gsap.to(pointLightRef.current.position, {
        x: normalizedX, // Apply normalized X
        y: normalizedY, // Apply normalized Y
        z: 2,
        duration: 0.2, // Smooth transition
        ease: "power2.out", // Easing for smooth movement
      });

      gsap.to(modelRef.current.position, {
        x: -normalizedX / 30,
        y: -normalizedY / 30,
        duration: 0.4,
      });
    };

    document.addEventListener("mousemove", handlePointLightMove);

    // Cleanup listeners on component unmount
    return () => {
      document.removeEventListener("mousemove", handlePointLightMove);
    };
  });

  return (
    <>
      <Center>
        <group ref={modelRef}>
          <Model scale={0.32} rotation-y={degToRad(0)} />
        </group>
      </Center>
      <directionalLight intensity={1} position={[0, -1, -10]} />
      <pointLight
        ref={pointLightRef}
        intensity={2}
        position={[1, 1, 2]}
        color={"#ffff"}
      />
      {colors.map((color, index) => (
        <PointLightWithMesh key={index} color={color} radius={radius} />
      ))}
    </>
  );
}
