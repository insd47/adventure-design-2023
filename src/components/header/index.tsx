"use client";
import { Button } from "@insd47/library";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <h2>Adventure Design</h2>
      <Button size="small" onClick={() => fetch("/api/auth/logout").then((res) => router.push(res.url))}>Sign Out</Button>
    </header>
  );
}