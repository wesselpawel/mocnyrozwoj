"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import StaticTest from "@/components/Products/StaticTest";
import { useAuth } from "@/components/AuthContext";
import { IProduct, Diet } from "@/types";

export default function LandingTestTriggerImage({
  image,
  alt,
  testProduct,
}: {
  image: StaticImageData;
  alt: string;
  testProduct: IProduct | Diet;
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
        className="block w-full text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e77503] focus-visible:ring-offset-2"
        aria-label="Rozpocznij test"
      >
        <Image
          src={image}
          width={600}
          height={400}
          alt={alt}
          className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
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
