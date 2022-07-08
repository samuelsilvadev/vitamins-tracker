import { Container } from "@wonderflow/react-components";
import { Routes, Route } from "react-router-dom";
import Home from "views/home/Home";
import styles from "./App.module.css";

function App() {
  return (
    <Container dimension="large" className={styles.container}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example" element={<h1>Example Route</h1>} />
      </Routes>
    </Container>
  );
}

export default App;
