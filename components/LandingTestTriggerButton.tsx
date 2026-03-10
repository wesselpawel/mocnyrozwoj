"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StaticTest from "@/components/Products/StaticTest";
import { useAuth } from "@/components/AuthContext";
import { IProduct, Diet } from "@/types";

export default function LandingTestTriggerButton({
  testProduct,
  label = "Do testu >",
}: {
  testProduct: IProduct | Diet;
  label?: string;
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
        className="inline-flex items-center rounded-full bg-[#e77503] px-6 py-3 font-semibold text-white hover:bg-[#d96c02] transition-colors duration-300 shadow-sm"
      >
        {label}
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
