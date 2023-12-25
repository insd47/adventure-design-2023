import Link from "next/link";
import styles from "./styles.module.scss";
import { Icon, IconType } from "@insd47/library";
import { LinkItem } from "./components";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul>
        <LinkItem name="Attendance" icon="list-u" href="/attendance" />
        <LinkItem name="Devices" icon="grid" activeIcon="grid-f" href="/devices" />
        <LinkItem name="Tokens" icon="tag" activeIcon="tag-f" href="/tokens" />
      </ul>
    </nav>
  );
}
