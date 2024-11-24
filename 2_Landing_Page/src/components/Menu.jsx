import { useAtom } from "jotai";
import React from "react";
import { CurrentFoodItem, foodItems } from "../context/ContextProvider";

export default function Menu() {
  const [currentFoodItem, setCurrentFoodItem] = useAtom(CurrentFoodItem);
  return (
    <div className="flex-1 w-full flex items-center justify-between">
      <svg
        onClick={() => {
          setCurrentFoodItem(
            (currentFoodItem - 1 + foodItems.length) % foodItems.length
          );
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 hover:opacity-50 cursor-pointer transition-opacity duration-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <svg
        onClick={() => {
          setCurrentFoodItem((currentFoodItem + 1) % foodItems.length);
          console.log(currentFoodItem);
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 hover:opacity-50 cursor-pointer transition-opacity duration-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}
