import { Link } from "react-router-dom";
import {
  List,
  Title,
  Button,
  Container,
  Stack,
  Chip,
} from "@wonderflow/react-components";
import FixedFooter from "components/fixed-footer/FixedFooter";
import { useConsumedFood } from "context/ConsumedFood";
import { Food } from "types/global";
import styles from "./Report.module.css";

type VitaminsMap = Record<number, { name: string; foods: { name: string }[] }>;

function groupByVitamins(foods: Food[]) {
  const groupedFoodsByVitamins = foods.reduce<VitaminsMap>((grouped, food) => {
    food.attributes.vitamins.data.forEach((vitamin) => {
      if (!grouped[vitamin.id]) {
        grouped[vitamin.id] = {
          name: vitamin.attributes.name,
          foods: [{ name: food.attributes.name }],
        };
      } else {
        grouped[vitamin.id].foods.push({ name: food.attributes.name });
      }
    });

    return grouped;
  }, {});

  return groupedFoodsByVitamins;
}

function Report() {
  const { foods } = useConsumedFood();
  const onlyFoods = foods.map(([, { food }]) => food);
  const groupedFoods = groupByVitamins(onlyFoods);
  const vitamins = Object.values(groupedFoods);

  return (
    <Container className={styles.reportWrapper}>
      <header className={styles.reportHeader}>
        <Title level="1">Vitamins consumed today:</Title>
      </header>
      <List hideMarker>
        {vitamins.map(({ name, foods }) => {
          return (
            <List.Li key={name}>
              <Stack className={styles.vitaminCardWrapper} columnGap={8}>
                <Title level="2">{name}</Title>
                <Stack direction="row" columnGap={8} as={List} hideMarker>
                  {foods.map(({ name: foodName }) => (
                    <List.Li key={foodName}>
                      <Chip color="green">{foodName}</Chip>
                    </List.Li>
                  ))}
                </Stack>
              </Stack>
            </List.Li>
          );
        })}
      </List>
      <FixedFooter>
        <Button as={Link} to="/" kind="primary">
          Foods
        </Button>
      </FixedFooter>
    </Container>
  );
}

export default Report;
