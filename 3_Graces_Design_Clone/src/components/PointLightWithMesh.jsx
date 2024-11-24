import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PointLightWithMesh = ({ color, radius }) => {
  const lightRef = useRef();
  const meshRef = useRef();
  const circleRef = useRef();

  useEffect(() => {
    // Set initial position
    meshRef.current.position.set(radius, radius, 0);

    // Create a rotation speed
    const rate = Math.random() * 0.01 + 0.005;

    // Animation function
    const animate = () => {
      circleRef.current.rotation.z += rate;
      circleRef.current.rotation.y += rate;
      circleRef.current.rotation.x += rate;
    };

    const interval = setInterval(animate, 16); // Approximately 60 FPS

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [radius]);

  // Animate light position or rotation every frame
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(meshRef.current.position);
    }
  });

  return (
    <group ref={circleRef}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.01, 0]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight ref={lightRef} intensity={1} distance={2.0} color={color} />
    </group>
  );
};
export default PointLightWithMesh;
