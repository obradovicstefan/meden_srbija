"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterSlot() {
  const pathname = usePathname();

  if (pathname === "/product/meden") {
    return null;
  }

  return <Footer />;
}
