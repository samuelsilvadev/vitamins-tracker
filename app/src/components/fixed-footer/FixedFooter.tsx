import { Container } from "@wonderflow/react-components";
import type { ReactNode } from "react";
import styles from "./FixedFooter.module.css";

type FixedFooterProps = {
  children: ReactNode;
};

function FixedFooter({ children }: FixedFooterProps) {
  return (
    <Container as="footer" dimension="large" className={styles.fixedFooter}>
      {children}
    </Container>
  );
}

export default FixedFooter;
