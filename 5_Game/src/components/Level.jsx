import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";

THREE.ColorManagement.legacyMode = false;
// instantiating only one Geometry To Optimize the Performance
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: "limegreen",
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: "greenyellow",
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "red",
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "grey",
});

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.26} speed={2}>
        <Text
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          rotation-y={-0.25}
          position={[0.75, 0.8, -0.6]}
          scale={0.3}
        >
          Let's Go
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floorMaterial}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacleRef = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.8) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* Rigidbody */}
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2} // Not Much affect On the Another Component
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacleRef = useRef();
  const [speed] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + speed) + 1.15; // -1 to 1

    obstacleRef.current.setNextKinematicTranslation({
      x: position[0],
      y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* Rigidbody */}
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2} // Not Much affect On the Another Component
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockAxes({ position = [0, 0, 0] }) {
  const obstacleRef = useRef();
  const [speed] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + speed); // -1 to 1

    obstacleRef.current.setNextKinematicTranslation({
      x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* Rigidbody */}
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2} // Not Much affect On the Another Component
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }) {
  const { scene } = useGLTF("./hamburger.glb");

  useEffect(() => {
    scene.children.map((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }, []);
  return (
    <group position={position}>
      <Text
        maxWidth={0.25}
        lineHeight={0.75}
        textAlign="right"
        rotation-y={-0.25}
        position={[0, 0.8, 2]}
        scale={0.3}
      >
        Finish
      </Text>
      <mesh
        geometry={boxGeometry}
        material={floorMaterial}
        position={[0, 0, 0]}
        scale={[4, 0.4, 4]}
        receiveShadow
      ></mesh>
      <RigidBody type="fixed" colliders="hull" restitution={0.2} friction={0}>
        <primitive object={scene} position-y={0.75} scale={0.2} />
      </RigidBody>
      <CuboidCollider
        args={[2, 0.1, 2]}
        position={[0, 0.1, position[2]]}
        restitution={0.2}
        friction={1}
      />
    </group>
  );
}

function Bounds({ length = 1 }) {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <mesh
        geometry={boxGeometry}
        material={wallMaterial}
        position={[2.15, 0.55, -(length * 2) + 2]}
        scale={[0.3, 1.5, 4 * length]}
        castShadow
        receiveShadow
      ></mesh>
      <mesh
        geometry={boxGeometry}
        material={wallMaterial}
        position={[-2.15, 0.55, -(length * 2) + 2]}
        scale={[0.3, 1.5, 4 * length]}
        receiveShadow
      ></mesh>
      <mesh
        geometry={boxGeometry}
        material={wallMaterial}
        position={[0, 0.55, -(length * 4) + 2.149]}
        scale={[4, 1.5, 0.3]}
        receiveShadow
      ></mesh>
      <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  );
}

export default function Level({
  count = 5,
  types = [BlockSpinner, BlockLimbo, BlockAxes],
  seed = 0,
}) {
  console.log(seed);

  const blocks = useMemo(() => {
    const blocks = [];
    for (let index = 0; index < count; index++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, idx) => (
        <Block key={idx} position={[0, 0, -((idx + 1) * 4)]} />
      ))}
      <BlockEnd position={[0, 0, -((count + 1) * 4)]} />

      {/* Walls */}
      <Bounds length={count + 2} />
    </>
  );
}
