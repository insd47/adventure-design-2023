import styles from "./styles.module.scss";
import { ControlCard, Sensors } from "./components";

export default function Devices() {
  return <main className={styles.main}>
    <div className={styles.control}>
      <ControlCard name="Air Conditioner" isActive={true} isEnabled={true} description={`This device is controlled by IR.\nStatus of this device displayed here might be inaccurate.`} />
      <ControlCard name="Light" isActive={false} isEnabled={false} description={`Unsupported yet.\n\n`} />
      <ControlCard name="Air Cleaner" isActive={false} isEnabled={false} description={`Unsupported yet.\n\n\n`} />
    </div>
    <Sensors />
  </main>;
}
