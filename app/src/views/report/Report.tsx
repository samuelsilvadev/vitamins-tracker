import { List } from "@wonderflow/react-components";
import { useConsumedFood } from "context/ConsumedFood";

function Report() {
  const { foods } = useConsumedFood();

  return (
    <List>
      {foods.map(([foodId, { food, quantity }]) => {
        return (
          <List.Li key={foodId}>
            {food.attributes.name} - {quantity}
          </List.Li>
        );
      })}
    </List>
  );
}

export default Report;
