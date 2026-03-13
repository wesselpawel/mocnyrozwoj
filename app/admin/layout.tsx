"use client";
import Nav from "./Nav";
import { useState } from "react";
import Toast from "@/components/Toast";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavOpen, setNavOpen] = useState(true);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return (
      <div className="w-full relative z-[9999] bg-white">
        <Toast />
        {children}
      </div>
    );
  }

  return (
    <div className="w-full relative z-[9999] bg-white">
      <Toast />
      <Nav isNavOpen={isNavOpen} setNavOpen={setNavOpen} />
      <div
        className={`${
          isNavOpen ? "pl-[300px]" : "pl-[0px]"
        } duration-500 min-w-full min-h-screen bg-white font-montserrat`}
      >
        {children}
      </div>
    </div>
  );
}
