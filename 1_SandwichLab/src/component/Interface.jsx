import React from "react";
import { INGREDIENTS, useSandwich } from "../context/SandwichProvider";
import "../index.css";
import ButtonUI from "./ButtonUI";
// <AwesomeButton
//   title={
//     INGREDIENTS[ingredient].icon +
//     ` ${capitalizeFirstLetter(ingredient)} (+${INGREDIENTS[
//       ingredient
//     ].price.toFixed(2)})`
//   }
//   onPress={() => addIngredient(ingredient)}
// />

export default function Interface() {
  const { total, addToCard, setAddtoCart } = useSandwich();

  return (
    <>
      <div className="px-3 overflow-hidden absolute   bottom-0 right-0 bg-[#ffffff]  w-full  md:right-0 md:w-[450px] md:h-full">
        {addToCard ? (
          <div className="p-2">
            <h1 className="text-lg font-extrabold">
              Total - ₹ {total.toFixed(2)}
            </h1>
            <p className="text-gray-600 mt-1 mb-4">
              Order sent successfully, it will be ready in 5 minutes! will
              directly deliver it to your home 🛵
            </p>
            <button
              className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 w-full"
              onClick={() => setAddtoCart(false)}
            >
              Cancel order
            </button>
          </div>
        ) : (
          <div className="w-ful h-full flex flex-col gap-4 my-2">
            <div className="flex flex-wrap gap-2 items-center">
              <h1 className="text-xl uppercase text-green-900 font-extrabold md:text-3xl">
                Sandwich Lab
              </h1>
              <p className="text-sm md:text-md">⭐️⭐️⭐️⭐️⭐️</p>
            </div>

            <p className="text-sm md:text-md font-bold text-wrapp w-[90%]">
              Total : ₹ {total}{" "}
            </p>
            <p className="text-sm md:text-md font-bold text-wrapp w-[90%]">
              Make Your Fresh and delicious sandwiches
            </p>
            <div className="overflow-scroll flex md:flex-wrap justify-between items-center gap-3">
              {Object.keys(INGREDIENTS).map((ingredient, i) => (
                <ButtonUI
                  key={i}
                  icon={INGREDIENTS[ingredient].icon}
                  text={` ${ingredient} (+ ₹${INGREDIENTS[
                    ingredient
                  ].price.toFixed(2)})`}
                  ingredient={ingredient}
                />
              ))}
            </div>

            <button
              className=" text-sm md:text-md p-2 border-2 border-green-500 text-black rounded  w-full flex-shrink-0 bg-green-500 hover:bg-green-300 font-bold"
              onClick={() => setAddtoCart(true)}
            >
              ADD TO CART
            </button>
          </div>
        )}
      </div>
    </>
  );
}
