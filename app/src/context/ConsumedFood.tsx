import { createContext, ReactElement, useContext, useState } from "react";
import { Food } from "types/global";

type ConsumedFoodProps = {
  children: ReactElement;
};

type ConsumedFoodWithQuantity = {
  food: Food;
  quantity: number;
};

type ConsumedFoodContextDefinition = {
  foods: [string, ConsumedFoodWithQuantity][];
  addConsumedFood: (food: Food) => void;
};

const ConsumedFoodContext = createContext<ConsumedFoodContextDefinition>({
  foods: [],
  addConsumedFood: () => null,
});

const DEFAULT_QUANTITY = 1;

export function ConsumedFoodProvider(props: ConsumedFoodProps) {
  const [foods, setFoods] = useState(
    new Map<string, ConsumedFoodWithQuantity>()
  );

  const addConsumedFood = (food: Food) => {
    setFoods((previousFoods) => {
      const previousQuantity = previousFoods.get(food.id)?.quantity ?? 0;
      const updatedQuantity = previousQuantity + DEFAULT_QUANTITY;

      return new Map([
        ...previousFoods,
        [food.id, { food, quantity: updatedQuantity }],
      ]);
    });
  };

  return (
    <ConsumedFoodContext.Provider
      {...props}
      value={{ foods: [...foods.entries()], addConsumedFood }}
    />
  );
}

export function useConsumedFood() {
  const consumedFood = useContext(ConsumedFoodContext);

  // TODO: check if exists

  return consumedFood;
}
