import { createContext, ReactElement, useContext, useState } from "react";

type ConsumedFoodProps = {
  children: ReactElement;
};

type ConsumedFoodContextDefinition = {
  foods: Map<string, number>;
  addConsumedFoodId: (foodId: string) => void;
};

const ConsumedFoodContext = createContext<ConsumedFoodContextDefinition>({
  foods: new Map(),
  addConsumedFoodId: () => null,
});

const DEFAULT_QUANTITY = 1;

export function ConsumedFoodProvider(props: ConsumedFoodProps) {
  const [foods, setFoods] = useState(new Map<string, number>());

  const addConsumedFoodId = (foodId: string) => {
    setFoods((previousFoods) => {
      const previousQuantity = previousFoods.get(foodId) ?? 0;
      const updatedQuantity = previousQuantity + DEFAULT_QUANTITY;

      return new Map([...previousFoods, [foodId, updatedQuantity]]);
    });
  };

  return (
    <ConsumedFoodContext.Provider
      {...props}
      value={{ foods, addConsumedFoodId }}
    />
  );
}

export function useConsumedFood() {
  const consumedFood = useContext(ConsumedFoodContext);

  // TODO: check if exists

  return consumedFood;
}
