"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Switch } from "@insd47/library";

export const ControlCard: React.FC<{
  name: string;
  isActive: boolean;
  isEnabled: boolean;
  description: string;
  onChange?: (value: boolean) => void;
}> = ({ name, isActive, isEnabled, description, onChange }) => {
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
        <Switch
          disabled={!isActive}
          checked={isEnabled}
          onChange={onChange}
          name={"switch-" + name.replaceAll(" ", "")}
        />
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

export const Socket: React.FC = () => {
  const [sensorValues, setSensorValues] = useState<SensorValue[]>([]);
  const refreshTimer = useRef<NodeJS.Timeout>();
  const socketRef = useRef<WebSocket>();

  const controlNames = ["Air Conditioner", "Light", "Air Cleaner"];
  const [controls, setControls] = useState<[boolean, boolean, boolean]>([false, false, false]);

  useEffect(() => {
    const socket = new WebSocket(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.host
      }/api/ws`
    );

    socketRef.current = socket;

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
    <>
      <div className={styles.control}>
        {controlNames.map((name, index) => (
          <ControlCard
            key={name}
            name={name}
            isActive={true}
            isEnabled={controls[index]}
            description={`Unsupported yet.`}
            onChange={(value) => {
              setControls((prev) => {
                const newControls: [boolean, boolean, boolean] = [...prev];
                newControls[index] = value;
                return newControls;
              });

              socketRef.current?.send(`SET_DEVICE_${index}=${value ? "1" : "0"}`);
            }}
          />))}
      </div>
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
    </>
  );
};
