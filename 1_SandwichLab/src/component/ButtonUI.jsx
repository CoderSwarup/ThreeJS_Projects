import React from "react";
import { useSandwich } from "../context/SandwichProvider";

export default function ButtonUI({ icon, text, ingredient }) {
  const { addIngredient } = useSandwich();
  return (
    <button
      className="text-sm md:text-md p-2 border-2 border-green-500 text-black rounded  w-[210px] md:w-[200px] flex-shrink-0 bg-green-100"
      onClick={() => addIngredient(ingredient)}
    >
      {icon} {text.toUpperCase()}
    </button>
  );
}
