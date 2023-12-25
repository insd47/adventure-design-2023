import { cookies } from "next/headers";

import styles from "./styles.module.scss";
import { Buttons, Form } from "./components";
import { redirect } from "next/navigation";

export default function Login() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (token) {
    redirect("/attendance");
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <img
          src={"/images/background.jpg"}
        />
      </div>
      <div className={styles.body}>
        <h2>Sign In</h2>
        <Form />
        <div className={styles.seperator}>
          <span>OR</span>
        </div>
        <Buttons />
      </div>
    </main>
  );
}
