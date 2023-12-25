
import styles from "./styles.module.scss";
import { ControlCard, InfoCard } from "./components";

export default function Devices() {
  return <main className={styles.main}>
    <div className={styles.control}>
      <ControlCard name="Air Conditioner" isActive={true} isEnabled={true} description={`This device is controlled by IR.\nStatus of this device displayed here might be inaccurate.`} />
      <ControlCard name="Air Cleaner" isActive={true} isEnabled={true} description={`PM10: \nPM2.5: \nPM1:`} />
    </div>
    <div className={styles.info}>
      <InfoCard name="Temperature" isActive={true} value={25} unit="°C" />
      <InfoCard name="Humidity" isActive={true} value={50} unit="%" />
      <InfoCard name="Fart Smell" isActive={true} value={126} unit="ppm" />
    </div>
  </main>;
}
