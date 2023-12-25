"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import { Icon, IconType } from "@insd47/library";
import { usePathname } from "next/navigation";

export const LinkItem: React.FC<{
  name: string;
  href: string;
  icon: IconType;
  activeIcon?: IconType;
}> = ({name, href, icon, activeIcon}) => {
  const pathname = usePathname();

  const isActive =
  href === "/" ? href === pathname : pathname.slice(0, href.length) === href;

  return (
    <li className={[styles.item, isActive ? styles.active : ""].join(" ")}>
      <Link href={href}>
        <Icon size={18} type={isActive && activeIcon ? activeIcon : icon} />
        <span>{name}</span>
      </Link>
    </li>
  );
}