"use client";

import styles from "./styles.module.scss";
import {
  Boolean,
  Button,
  Loading,
  Spacing,
  Textfield,
  useModal,
} from "@insd47/library";

import { Student, Attendance, AttendanceStatus } from "@/firebase/types";
import { useEffect, useState } from "react";
import { get } from "http";

export const Toolbar: React.FC<{
  students: (Student & Attendance)[];
  selected: string[];
  getData: () => void;
}> = ({ students, selected, getData }) => {
  const [form, setForm] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setOpen] = useModal({
    title: "Add Student",
    content: (
      <ul className={styles["add-form"]}>
        <li>
          <Textfield
            type="text"
            placeholder="202355500"
            stretch
            label="Student ID"
            value={form.id}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                id: e.target.value,
              }))
            }
          />
        </li>
        <li>
          <Textfield
            type="text"
            placeholder="John Doe"
            stretch
            label="Student Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </li>
      </ul>
    ),
    width: 500,
    outsideClick: true,
    buttons: [
      <Button key="1" size="small" onClick={() => setOpen(false)}>
        Cancel
      </Button>,
      <Spacing key="2" />,
      <Button
        key="3"
        type="filled"
        size="small"
        disabled={form.id.length < 8 || form.name.length < 3}
        loading={isLoading}
        onClick={() => {
          setIsLoading(true);
          fetch("/api/students", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }).then(() => {
            setOpen(false);
            setIsLoading(false);
            getData();
            setForm({
              id: "",
              name: "",
            });
          });
        }}
      >
        Submit
      </Button>,

    ],
  });

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        {selected.length > 0 && (
          <>
            <Button size="small" icon="trash" type="warn" onClick={() => {}}>
              Delete
            </Button>
          </>
        )}
      </div>
      <div className={styles.right}>
        <Button size="small" icon="reload" onClick={() => getData()}>Reload</Button>
        <Button
          size="small"
          icon="plus"
          type="filled"
          onClick={() => setOpen(true)}
        >
          Add Student
        </Button>
      </div>
      {modal}
    </div>
  );
};

export const ListItem: React.FC<{
  isChecked?: boolean;
  name: string;
  id: string;
  status: AttendanceStatus;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ name, id, isChecked, status, onChange }) => {
  const [statusState, setStatusState] = useState<AttendanceStatus>(status);

  const attendanceHandler = (status: AttendanceStatus) => {
    fetch("/api/attendance", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        status,
      }),
    });

    setStatusState(status);
  };

  return (
    <div className={styles.item}>
      <div>
        <Boolean type="checkbox" checked={isChecked} onChange={onChange} />
      </div>
      <span>{id}</span>
      <span>{name}</span>
      {[
        AttendanceStatus.ATTENDANCE,
        AttendanceStatus.ABSENCE,
        AttendanceStatus.EARLY_DEPARTURE,
        AttendanceStatus.TARDINESS,
      ].map((status) => (
        <div key={status} className={styles.center}>
          <Boolean
            name={`student-${id}`}
            value={status}
            type="radio"
            checked={statusState === status}
            onChange={(e) => {
              e.target.checked && attendanceHandler(status);
              setStatusState(status);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export const ListGrid: React.FC = () => {
  const [students, setStudents] = useState<(Student & Attendance)[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    setIsLoading(true);
    fetch("/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Toolbar students={students} selected={selected} getData={getData} />
      <div className={styles.list_grid}>
        <header>
          <div>
            <Boolean
              type="checkbox"
              checked={selected.length > 0}
              onChange={() => {
                if (selected.length === students.length) setSelected([]);
                else setSelected(students.map((student) => student.id));
              }}
            />
          </div>
          <span>ID</span>
          <span>Name</span>
          <span style={{ textAlign: "center" }}>Att.</span>
          <span style={{ textAlign: "center" }}>Abs.</span>
          <span style={{ textAlign: "center" }}>E.D.</span>
          <span style={{ textAlign: "center" }}>Tar.</span>
        </header>
        {!isLoading && students.length > 0 ? (
          students.map((student) => (
            <ListItem
              key={student.id}
              name={student.name}
              id={student.id}
              isChecked={selected.includes(student.id)}
              status={student.status}
              onChange={(e) => {
                if (e.target.checked) setSelected([...selected, student.id]);
                else setSelected(selected.filter((id) => id !== student.id));
              }}
            />
          ))
        ) : (
          <div className={styles["no-students"]}>
            {isLoading ? <Loading size="small" /> : "No Students"}
          </div>
        )}
      </div>
    </>
  );
};
