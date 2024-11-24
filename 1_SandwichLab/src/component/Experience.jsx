import React, { useRef } from "react";
import Ingredient from "./Ingredient";
import { useSandwich } from "../context/SandwichProvider";
import { Center, ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
const INGREDIENT_SPACING = 0.21;
const INGREDIENT_SPACING_FINAL = 0.06;

export default function Experience() {
  const sandwich = useRef();
  const { addedToCart, removeItem, ingredients, addToCard } = useSandwich();
  let ingredientSpacing = addToCard
    ? INGREDIENT_SPACING_FINAL
    : INGREDIENT_SPACING;
  const isMobileView = window.innerWidth < 500;
  const mobileAdjustment = isMobileView ? 1 : 0;

  useFrame((_, delta) => {
    if (addToCard == true) {
      sandwich.current.rotation.y += 0.015;
    } else {
      sandwich.current.rotation.y = 0;
    }
  });
  return (
    <>
      <group
        position-y={
          (-ingredients.length * ingredientSpacing) / 2 + mobileAdjustment
        }
      >
        <group ref={sandwich}>
          {ingredients.map((ingredient, index) => (
            <Ingredient
              key={ingredient.id + ingredient.name + Math.random()}
              showPrice={index > 0 && index < ingredients.length - 1}
              ingredient={ingredient}
              positionY={index * ingredientSpacing}
            />
          ))}
        </group>
        <ContactShadows position-y={-1} />
      </group>
    </>
  );
}
