import {
  AccumulativeShadows,
  CameraControls,
  Environment,
  Float,
  Gltf,
  MeshReflectorMaterial,
  RandomizedLight,
  RenderTexture,
  Sky,
  Text,
} from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { degToRad, lerp } from "three/src/math/MathUtils.js";
import { Cook } from "./Cook";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CurrentFoodItem,
  CurrentView,
  foodItems,
} from "../context/ContextProvider";
import { useAtom } from "jotai";

export default function Experience() {
  const viewPort = useThree((state) => state.viewport);
  const isMobileView = window.innerWidth <= 500;
  const isTabletView = window.innerWidth <= 800;

  const cameracontrol = useRef();
  const BoxtoFitRef = useRef();
  const tentBoxRef = useRef();
  const [currentView, setCurrentView] = useAtom(CurrentView);

  const fitTheRef = () => {
    if (currentView === "Tent") {
      cameracontrol.current.smoothTime = 0.7;
      cameracontrol.current.fitToBox(tentBoxRef.current, true);
    }
  };

  const restaurantScalingFactor = Math.min(
    Math.max(window.innerWidth / 900, 0.5),
    1.2
  );

  const CookScalingFactor = Math.min(
    Math.max(window.innerHeight / 800, 0.5),
    1
  );

  const TextAndModelScalingFactor = Math.min(
    Math.max(window.innerWidth / 800, 0.1),
    0.9
  );

  useEffect(() => {
    fitTheRef();
    window.addEventListener("resize", fitTheRef);
    return window.removeEventListener("resize", fitTheRef);
  }, [fitTheRef]);

  return (
    <>
      {/* <CameraControls ref={cameracontrol} /> */}
      {/* Restaurant */}
      <group
        rotation-y={-degToRad(23)}
        position-y={-0.3}
        scale={restaurantScalingFactor}
      >
        <directionalLight intensity={2} position-x={2}></directionalLight>
        <Gltf src="models/Restaurant.glb" scale={0.18} castShadow />
        {/* <AccumulativeShadows
        temporal
        frames={35}
        alphaTest={0.65}
        scale={10}
        position={[0, 0.01, 0]}
        color="#ffae00"
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.55}
          ambient={0.25}
          position={[5, 5, -10]}
        />
        <RandomizedLight
          amount={4}
          radius={5}
          intensity={0.25}
          ambient={0.55}
          position={[-5, 5, -9]}
        />
      </AccumulativeShadows> */}
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[100, 100]}
            resolution={128}
            mixBlur={1}
            mixStrength={10}
            roughness={1}
            depthScale={1}
            opacity={0.5}
            transparent
            minDepthThreshold={2}
            maxDepthThreshold={1.4}
            color="#171717"
            metalness={0.5}
          />
        </mesh>
      </group>

      {/* Chracter */}
      <group
        position-x={isMobileView ? 0 : 2}
        position-y={-viewPort.height}
        rotation-y={degToRad(-20)}
        scale={CookScalingFactor}
      >
        <Cook position-y={isMobileView ? -1.5 : -0.5} />
      </group>

      {/* Out WOrk Group */}
      <group position-y={-viewPort.height * 2}>
        {foodItems.map((ele, i) => (
          <FoorItem key={i} ele={ele} i={i} />
        ))}
      </group>

      {/* Text  with  Model */}
      <group position-y={-viewPort.height * 3}>
        <mesh ref={BoxtoFitRef} position-z={1.5} visible={false}>
          <boxGeometry args={[7.5, 2, 2]} />
          <meshBasicMaterial color={"red"} transparent opacity={0.3} />
        </mesh>

        {/* TEXT */}
        <group rotation-y={isTabletView ? 0 : degToRad(25)}>
          <Text
            scale={TextAndModelScalingFactor}
            font="/Poppins-Black.ttf"
            fontSize={0.9}
            lineHeight={0.8}
            position-y={isTabletView ? 0.1 : -0.5}
            anchorY={"bottom"}
            position-x={isTabletView ? -0 : -2.2}
            color={"#00e1ff"}
            textAlign="center"
          >
            EXPLORE{"\n"}WORLD
            <meshBasicMaterial toneMapped={false}>
              <RenderTexture attach={"map"}>
                <color attach={"background"} color="#00e1ff" />
                <Float floatIntensity={5} speed={2}>
                  <Gltf
                    src="models/Restaurant.glb"
                    scale={0.27}
                    position-y={-0.6}
                  />
                </Float>
                <Environment preset="sunset" />
              </RenderTexture>
            </meshBasicMaterial>
          </Text>
        </group>

        {/* Model */}
        <group
          rotation-y={isTabletView ? -0 : -degToRad(25)}
          scale={TextAndModelScalingFactor}
        >
          <mesh ref={tentBoxRef} position-x={2} visible={false}>
            <boxGeometry args={[3.5, 2, 1]} />
            <meshBasicMaterial color={"red"} transparent opacity={0.3} />
          </mesh>
          <Gltf
            src="models/Restaurant.glb"
            scale={0.15}
            position-y={-0.5}
            position-z={1.5}
            position-x={isTabletView ? 0 : 1.7}
          />
        </group>

        <mesh position-y={-0.5} position-z={1.5} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[20, 8]} />
          <MeshReflectorMaterial
            blur={[50, 50]}
            resolution={512}
            mixBlur={1}
            mixStrength={10}
            roughness={1}
            depthScale={1}
            opacity={0.5}
            transparent
            minDepthThreshold={2}
            // maxDepthThreshold={1.4}
            color="#0f0f0f"
            metalness={0.5}
          />
        </mesh>
      </group>

      <Environment preset="sunset" />
      {/* <Sky /> */}
    </>
  );
}

export const FoorItem = ({ ele, i }) => {
  const foodRef = useRef();
  const viewPort = useThree((state) => state.viewport);
  const [currentFoodItem, setCurrentFoodItem] = useAtom(CurrentFoodItem);
  const FoodItemScalingFactor = Math.min(
    Math.max(window.innerHeight / 1300, 0.2),
    1
  );
  useFrame((_, delta) => {
    if (foodRef.current) {
      // const { x, y, z } = foodRef.current.position;
      const currentItem = currentFoodItem - i;

      //   console.log(foodRef.current.position);
      // foodRef.current.position.x = currentItem * viewPort.width;
      foodRef.current.position.x = lerp(
        foodRef.current.position.x,
        -currentItem * viewPort.width - 0.05,
        0.1
      );

      // console.log((1 - i) * 2);
    }
  });
  return (
    <Float floatIntensity={1} speed={0.72}>
      <Gltf
        ref={foodRef}
        src={`models/${ele.model}.gltf`}
        scale={FoodItemScalingFactor}
        position-x={i}
        position-y={-0.5}
      />
    </Float>
  );
};
