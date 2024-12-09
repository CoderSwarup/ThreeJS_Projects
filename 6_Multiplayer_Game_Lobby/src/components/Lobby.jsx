import {
  Billboard,
  Box,
  CameraControls,
  Image,
  PerspectiveCamera,
  Text,
  useGLTF,
} from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import Lights from "./Lights";
import { myPlayer, usePlayersList } from "playroomkit";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { Car, CarSwitcher } from "./Car";
import { degToRad } from "three/src/math/MathUtils.js";
import { NameEditingAtom } from "./UI";
import { useAtom } from "jotai";
const CAR_SPACING = 2.5;

export default function Lobby() {
  const { scene } = useGLTF("./models/garage.glb");
  const [nameEditing, setNameEditing] = useAtom(NameEditingAtom);
  const players = usePlayersList(true);
  const me = myPlayer();

  const controls = useRef();
  const cameraReference = useRef();

  const viewport = useThree((state) => state.viewport);

  const adjustCamera = () => {
    const distFactor =
      10 /
      viewport.getCurrentViewport(cameraReference.current, new Vector3(0, 0, 0))
        .width;
    controls.current.setLookAt(
      4.2 * distFactor,
      2 * distFactor,
      7.5 * distFactor,
      0,
      0.15,
      0,
      true
    );
  };

  useEffect(() => {
    adjustCamera();
  }, [players]);

  useEffect(() => {
    const onResize = () => {
      console.log("on resize");
      adjustCamera();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  return (
    <>
      <PerspectiveCamera ref={cameraReference} position={[0, 1, 10]} />
      <CameraControls ref={controls} />
      <Lights controls={controls}>
        <primitive object={scene} />
        {players.map((player, idx) => (
          <group
            position-x={
              idx * CAR_SPACING - ((players.length - 1) * CAR_SPACING) / 2
            }
            key={player.id}
            scale={0.8}
          >
            <Billboard position-y={2.1} position-x={0.5}>
              <Text fontSize={0.34} anchorX={"right"}>
                {player.state.name || player.state.profile.name}
                <meshBasicMaterial color="white" />
              </Text>
              <Text
                fontSize={0.34}
                anchorX={"right"}
                position-x={0.02}
                position-y={-0.02}
                position-z={-0.01}
              >
                {player.state.name || player.state.profile.name}
                <meshBasicMaterial color="black" transparent opacity={0.8} />
              </Text>
              {player.id === me?.id && (
                <>
                  <Image
                    onClick={() => setNameEditing(true)}
                    position-x={0.2}
                    scale={0.3}
                    url="images/edit.png"
                    transparent
                  />
                  <Image
                    position-x={0.2 + 0.02}
                    position-y={-0.02}
                    position-z={-0.01}
                    scale={0.3}
                    url="images/edit.png"
                    transparent
                    color="black"
                  />
                </>
              )}
            </Billboard>
            <group position-y={player?.id === me?.id ? 0.15 : 0}>
              <CarSwitcher player={player} />
            </group>

            {player.id === me?.id && (
              <>
                <pointLight
                  position-x={1}
                  position-y={2}
                  intensity={2}
                  distance={3}
                />
                <group rotation-x={degToRad(-90)} position-y={0.01}>
                  <mesh receiveShadow>
                    <circleGeometry args={[2.2, 64]} />
                    <meshStandardMaterial
                      color="pink"
                      toneMapped={false}
                      emissive={"pink"}
                      emissiveIntensity={1.2}
                    />
                  </mesh>
                </group>
                <mesh position-y={0.1} receiveShadow>
                  <cylinderGeometry args={[2, 2, 0.2, 64]} />
                  <meshStandardMaterial color="#8572af" />
                </mesh>
              </>
            )}
          </group>
        ))}
      </Lights>
    </>
  );
}

useGLTF.preload("./models/garage.glb");
