import { Container } from "@wonderflow/react-components";
import { ConsumedFoodProvider } from "context/ConsumedFood";
import { Routes, Route } from "react-router-dom";
import Home from "views/home/Home";
import styles from "./App.module.css";

function App() {
  return (
    <Container dimension="large" className={styles.container}>
      <ConsumedFoodProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/example" element={<h1>Example Route</h1>} />
        </Routes>
      </ConsumedFoodProvider>
    </Container>
  );
}

export default App;
