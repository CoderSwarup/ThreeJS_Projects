import { atom, useAtom } from "jotai";

export const foodItems = [
  {
    model: "Prop_Fish_Mackerel",
    name: "Mackerel",
    description:
      "A fish that is often found in the Atlantic Ocean. It is a popular food fish and is often served smoked, as an appetizer.",
  },
  {
    model: "Prop_Fish_Tuna",
    name: "Tuna",
    description:
      "A saltwater fish that belongs to the mackerel family. Tuna is a popular food. It is eaten by many people around the world.",
  },
  {
    model: "Food_OctopusNigiri",
    name: "Octopus Nigiri",
    description:
      "A type of sushi made of thinly sliced raw octopus and vinegared rice.",
  },
  {
    model: "Food_SalmonNigiri",
    name: "Salmon Nigiri",
    description:
      "A type of sushi made of thinly sliced raw salmon and vinegared rice.",
  },
  {
    model: "Food_SeaUrchinRoll",
    name: "Sea Urchin Roll",
    description:
      "A type of sushi made of sea urchin and vinegared rice, rolled with nori and topped with wasabi.",
  },
];

export const CurrentFoodItem = atom(0);

export const CurrentView = atom("Home");
