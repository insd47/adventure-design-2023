import styles from "./styles.module.scss";
import { Switch } from "@insd47/library";

export const ControlCard: React.FC<{
  name: string;
  isActive: boolean;
  isEnabled: boolean;
  description: string;
}> = ({ name, isActive, isEnabled, description }) => {
  return <div className={styles.card}>
    <header>
      <div className={styles.left}>
        <span>{name}</span>
        <span role="status" className={[styles.status, isActive ? styles.active : ""].join(" ")} />
      </div>
      <Switch name={"switch-" + name.replaceAll(" ", "")} />
    </header>
    <p>{description}</p>
  </div>
}

export const InfoCard: React.FC<{
  name: string;
  isActive: boolean;
  value: number;
  unit: string;
}> = ({ name, isActive, value, unit }) => {
  return <div className={styles.card}>
    <header>
      <div className={styles.top}>
        <span>{name}</span>
        <span role="status" className={[styles.status, isActive ? styles.active : ""].join(" ")} />
      </div>
      <span className={styles.value}>{value}{unit}</span>
    </header>
  </div>
}