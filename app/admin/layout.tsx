"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LoginPage from "./LoginPage";
import Nav from "./Nav";
import Loading from "./loading";
import { useState } from "react";
import Toast from "@/components/Toast";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const [isNavOpen, setNavOpen] = useState(true);
  if (loading) {
    return <Loading />;
  } else
    return (
      <div className="w-full relative z-[9999] bg-white">
        <Toast />
        {user ? (
          <>
            <Nav isNavOpen={isNavOpen} setNavOpen={setNavOpen} />
            <div
              className={`${
                isNavOpen ? "pl-[300px]" : "pl-[0px]"
              } duration-500 min-w-full min-h-screen bg-white font-pt`}
            >
              {children}
            </div>
          </>
        ) : (
          <LoginPage />
        )}
      </div>
    );
}
