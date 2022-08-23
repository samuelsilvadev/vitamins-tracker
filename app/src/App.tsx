import { Container } from "@wonderflow/react-components";
import { ConsumedFoodProvider } from "context/ConsumedFood";
import { Routes, Route } from "react-router-dom";
import Home from "views/home/Home";
import Report from "views/report/Report";
import styles from "./App.module.css";

function App() {
  return (
    <Container dimension="large" className={styles.container}>
      <ConsumedFoodProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<Report />} />
        </Routes>
      </ConsumedFoodProvider>
    </Container>
  );
}

export default App;
