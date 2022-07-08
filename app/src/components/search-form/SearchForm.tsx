import { Textfield, Button, Symbol } from "@wonderflow/react-components";
import { PrimitiveInputType } from "@wonderflow/react-components/dist/components/textfield/base-field";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./SearchForm.module.css";

function SearchForm() {
  const [foodName, setFoodName] = useState("");

  const handleOnChangeFoodName = (event: ChangeEvent<PrimitiveInputType>) => {
    setFoodName(event.target.value);
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleOnSubmit} className={styles.searchForm}>
      <Textfield
        type="text"
        label="Food name"
        className={styles.searchInput}
        value={foodName}
        onChange={handleOnChangeFoodName}
      />
      <Button aria-label="Search for the typed food name">
        <Symbol source="magnifying-glass" />
      </Button>
    </form>
  );
}

export default SearchForm;
