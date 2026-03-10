"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StaticTest from "@/components/Products/StaticTest";
import { useAuth } from "@/components/AuthContext";
import { IProduct, Diet } from "@/types";

export default function LandingTestTriggerWrapper({
  testProduct,
  children,
  className,
  ariaLabel = "Rozpocznij test",
}: {
  testProduct: IProduct | Diet;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const [test, setTest] = useState<IProduct | Diet | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!test) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [test]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (user) {
            router.push("/dashboard");
            return;
          }
          setTest(testProduct);
        }}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>

      {test && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setTest(null)}
          />
          <div className="relative w-full h-[calc(100dvh-1rem)] sm:h-[90vh] sm:max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl">
            <StaticTest setTest={setTest} test={test} />
          </div>
        </div>
      )}
    </>
  );
}
