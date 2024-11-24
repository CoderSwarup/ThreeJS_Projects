import { useGLTF } from "@react-three/drei";
import { createContext, useContext, useState } from "react";

export const INGREDIENTS = {
  bread: {
    src: "/models/Bread_Slice_Bread_0.glb", // URL to the asset
    price: 5,
    icon: "🍞",
  },
  lettuce: {
    src: "/models/Lettuce_Slice_Lettuce_0.glb",
    price: 10,
    icon: "🥬",
  },
  mushroom: {
    src: "/models/Mushroom_Slice_Mushroom_0.glb",
    price: 12,
    icon: "🍄",
  },
  tomato: {
    src: "/models/Tomato_Slice_Tomato_0.glb",
    price: 15,
    icon: "🍅",
  },
  cheese: {
    src: "/models/Cheese_Slice_Cheese_0.glb",
    price: 8,
    icon: "🧀",
  },
  chicken: {
    src: "/models/Chicken_Slice_Chicken_0.glb",
    price: 4,
    icon: "🍗",
  },
  sausage: {
    src: "/models/Sausage_Slice_Sausage_0.glb",
    price: 14,
    icon: "🌭",
  },
  salami: {
    src: "/models/Salami_Slice_Salami_0.glb",
    price: 11,
    icon: "🍖",
  },
  bacon: {
    src: "/models/Bacon_Slice_Bacon_0.glb",
    price: 20,
    icon: "🥓",
  },
  patty: {
    src: "/models/Patty_Slice_Patty_0.glb",
    price: 11,
    icon: "🍔",
  },
};

const SandwichContext = createContext({});

export const SandwichProvider = ({ children }) => {
  const [ingredients, setingredients] = useState([
    {
      id: 0,
      name: "bread",
    },
    {
      id: 1,
      name: "bread",
    },
  ]);
  let [total, setTotal] = useState(10);
  const [addToCard, setAddtoCart] = useState(false);

  const addIngredient = (addingredients) => {
    setTotal((prev) => (prev += INGREDIENTS[addingredients].price));
    setingredients((prev) => {
      return [
        ...prev.slice(0, -1),
        {
          name: addingredients,
          id: ingredients.length,
        },
        {
          name: "bread",
          id: 1,
        },
      ];
    });
  };

  const removeItem = (removeingredient) => {
    if (removeingredient.id === 0 || removeingredient.id === 1) {
      alert("SORRY CANT REMOVE");
      return;
    }

    setingredients((prev) => {
      return prev.filter((ingredient) => ingredient.id !== removeingredient.id);
    });
    setTotal((prev) => {
      if (prev - INGREDIENTS[removeingredient.name]?.price <= 0 || prev == 0) {
        return 10;
      }
      if (ingredients.length <= 2) {
        return 10;
      } else {
        return (prev -= INGREDIENTS[removeingredient.name]?.price);
      }
    });
  };
  return (
    <SandwichContext.Provider
      value={{
        ingredients,
        addIngredient,
        total,
        removeItem,
        addToCard,
        setAddtoCart,
      }}
    >
      {children}
    </SandwichContext.Provider>
  );
};

export const useSandwich = () => {
  return useContext(SandwichContext);
};

Object.keys(INGREDIENTS).forEach((ingredient) => {
  useGLTF.preload(INGREDIENTS[ingredient].src);
});
