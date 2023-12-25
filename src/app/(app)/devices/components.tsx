"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Switch } from "@insd47/library";

export const ControlCard: React.FC<{
  name: string;
  isActive: boolean;
  isEnabled: boolean;
  description: string;
}> = ({ name, isActive, isEnabled, description }) => {
  return (
    <div className={styles.card}>
      <header>
        <div className={styles.left}>
          <span>{name}</span>
          <span
            role="status"
            className={[styles.status, isActive ? styles.active : ""].join(" ")}
          />
        </div>
        <Switch disabled={!isActive} onChange={!isActive ? () => {} : undefined} name={"switch-" + name.replaceAll(" ", "")} />
      </header>
      <p>{description}</p>
    </div>
  );
};

export const InfoCard: React.FC<{
  name: string;
  isActive: boolean;
  value: string | number;
  unit: string;
}> = ({ name, isActive, value, unit }) => {
  return (
    <div className={styles.card}>
      <header>
        <div className={styles.top}>
          <span>{name}</span>
          <span
            role="status"
            className={[styles.status, isActive ? styles.active : ""].join(" ")}
          />
        </div>
        <span className={styles.value}>
          {value}
          {unit}
        </span>
      </header>
    </div>
  );
};

interface SensorValue {
  temperature: number;
  humidity: number;
  gas: number;
}

export const Sensors: React.FC = () => {
  const [sensorValues, setSensorValues] = useState<SensorValue[]>([]);
  const refreshTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.host}/api/ws`);
  
    socket.onopen = () => {
      console.log("websocket opened");
      socket.send("GET_SENSORS");
      refreshTimer.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send("GET_SENSORS");
        } else {
          clearInterval(refreshTimer.current);
        }
      }, 2000);
    };
  
    socket.onmessage = (event) => {
      if (
        event.data &&
        typeof event.data === "string" &&
        event.data.startsWith("SENSORS=")
      ) {
        const data = event.data.split("=")[1];
        const parsedData = JSON.parse(data) as SensorValue[];
        setSensorValues(parsedData);
      }
    };
  
    socket.onclose = () => {
      clearInterval(refreshTimer.current);
    };
  
    return () => {
      clearInterval(refreshTimer.current);
      socket.close();
    };
  }, []);

  const lastValue =
    sensorValues.length > 0 ? sensorValues[sensorValues.length - 1] : undefined;

  return (
    <div className={styles.info}>
      <InfoCard
        name="Temperature"
        isActive={!!lastValue}
        value={lastValue?.temperature ?? "--"}
        unit="°C"
      />
      <InfoCard
        name="Humidity"
        isActive={!!lastValue}
        value={lastValue?.humidity ?? "--"}
        unit="%"
      />
      <InfoCard
        name="Fart Smell"
        isActive={!!lastValue}
        value={lastValue?.gas ?? "--"}
        unit="ppm"
      />
    </div>
  );
};
