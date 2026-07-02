"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Огляд" },
  { href: "/inventory", label: "Запаси" },
  { href: "/procurement", label: "Закупівлі" },
  { href: "/manufacturing", label: "Виробництво" },
  { href: "/ledger", label: "Журнал рухів" },
];

export function Navigation() {
  const pathname = usePathname();

  return <nav aria-label="Головна навігація">{links.map((link) => {
    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
    return <Link key={link.href} href={link.href} aria-current={isActive ? "page" : undefined}>{link.label}</Link>;
  })}</nav>;
}
