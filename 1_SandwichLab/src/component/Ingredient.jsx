import { Gltf, Text3D } from "@react-three/drei";
import React from "react";
import { INGREDIENTS, useSandwich } from "../context/SandwichProvider";
import { animated, useSpring } from "@react-spring/three";

const INGREDIENT_SCALE = 3;
const INGREDIENT_SCALE_Y = 5;

export default function Ingredient({ ingredient, positionY }) {
  const { removeItem, addToCard } = useSandwich();
  const { position_y } = useSpring({ position_y: positionY });
  const { scale } = useSpring({
    from: {
      scale: 0.85,
    },
    to: {
      scale: 1,
    },
  });
  return (
    <animated.group scale={scale} position-y={position_y} position-z={0}>
      {!addToCard && ingredient.id !== 1 && ingredient.id !== 0 && (
        <group
          onPointerEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onClick={() => {
            removeItem(ingredient); // This should trigger re-render
          }}
        >
          <mesh position-x={0.7} position-y={0.042}>
            <planeGeometry args={[0.8, 0.16]} />
            <meshStandardMaterial color="white" opacity={0.42} transparent />
          </mesh>
          <Text3D
            scale={0.1}
            bevelSegments={3}
            bevelEnabled
            bevelThickness={0.001}
            position-x={0.42}
            font={"/fonts/Poppins_Bold.json"}
          >
            ₹ {INGREDIENTS[ingredient.name].price}
            <meshBasicMaterial color={"#000"} />
          </Text3D>
          <Text3D
            scale={0.1}
            bevelSegments={3}
            bevelEnabled
            bevelThickness={0.001}
            position-x={0.82}
            font={"/fonts/Poppins_Bold.json"}
          >
            x
            <meshBasicMaterial color={"red"} />
          </Text3D>
        </group>
      )}
      <Gltf
        src={INGREDIENTS[ingredient.name].src}
        scale={INGREDIENT_SCALE}
        scale-y={INGREDIENT_SCALE_Y + (ingredient.name === "bread" ? 5 : 0)}
      />
    </animated.group>
  );
}
