import styles from "./styles.module.scss";
import { ControlCard, Socket } from "./components";

export default function Devices() {
  return <main className={styles.main}>
    <Socket />
  </main>;
}
