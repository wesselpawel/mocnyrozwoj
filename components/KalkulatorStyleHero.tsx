import Image from "next/image";
import { ReactNode } from "react";
import { FaCheck } from "react-icons/fa";
import accent1 from "@/public/accent1.png";
import LandingTestTriggerButton from "@/components/LandingTestTriggerButton";
import LandingTestTriggerWrapper from "@/components/LandingTestTriggerWrapper";
import { getProducts } from "@/lib/getProducts";

type Props = {
  title: ReactNode;
  tagline: ReactNode;
  description: ReactNode;
  bullets: string[];
  className?: string;
  ariaLabel?: string;
  ctaLabel?: string;
};

export default async function KalkulatorStyleHero({
  title,
  tagline,
  description,
  bullets,
  className,
  ariaLabel = "Wygeneruj dietę AI po kliknięciu w wideo",
  ctaLabel = "Rozpocznij",
}: Props) {
  const products = await getProducts();
  const testProduct = products[0];

  return (
    <section className={className}>
      <div className="relative flex items-center justify-center overflow-hidden">
        <div className="z-50 pt-8 w-full">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 relative">
            <div className="absolute left-[-260px] lg:left-[-300px] top-[-144px] sm:top-[-128px] lg:top-[-100px] sm:left-[-320px] w-[350px] lg:w-[300px] h-auto z-[-1]">
              <Image
                src={accent1}
                width={1000}
                height={1000}
                alt=""
                aria-hidden="true"
                className="w-full h-full rotate-45"
                priority
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h1 className="font-extrabold text-3xl lg:text-5xl tracking-[0.6rem] font-montserrat text-[#1f1d1d]">
                  {title}
                </h1>
                <span className="block text-2xl sm:text-3xl lg:text-6xl mt-6 text-[#e77503] font-anton tracking-[0.1rem]">
                  {tagline}
                </span>
                <div className="mx-3 lg:mx-0 mt-6 text-black max-w-lg">
                  {description}
                </div>
                <div className="flex flex-wrap flex-row justify-center lg:justify-start gap-4 mt-8">
                  {bullets.map((label) => (
                    <div
                      key={label}
                      className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg"
                    >
                      <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                        <FaCheck className="text-white" />
                      </div>
                      <p className="text-white text-sm">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ml-3 mt-2">
                {testProduct ? (
                  <LandingTestTriggerWrapper
                    testProduct={testProduct}
                    className="block max-h-[80vh] w-full rounded-2xl overflow-hidden"
                    ariaLabel={ariaLabel}
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster="/generator-diety-ai-video.mp4"
                      className="w-full object-cover"
                    >
                      <source
                        src="/generator-diety-ai-video.mp4"
                        type="video/mp4"
                      />
                      Twoja przeglądarka nie obsługuje odtwarzania wideo.
                    </video>
                  </LandingTestTriggerWrapper>
                ) : null}
                <div className="mb-6 mt-6 flex justify-center gap-3">
                  {testProduct ? (
                    <LandingTestTriggerButton
                      testProduct={testProduct}
                      label={ctaLabel}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

