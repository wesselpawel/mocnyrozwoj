"use client";

import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaCheck } from "react-icons/fa";
import pc from "@/public/pc.svg";
import clock from "@/public/clock.svg";
import hat from "@/public/hat.svg";
import type { DietGoal } from "@/types/recipe";

type DietOnlineCTAProps = {
  goal?: DietGoal;
  variant?: "default" | "compact" | "hero";
};

const GOAL_TITLES: Record<DietGoal, string> = {
  mass: "SPERSONALIZOWANA DIETA NA MASĘ",
  reduction: "SPERSONALIZOWANA DIETA NA REDUKCJĘ",
  maintenance: "SPERSONALIZOWANA DIETA NA UTRZYMANIE",
};

const GOAL_SUBTITLES: Record<DietGoal, string> = {
  mass: "Zbuduj masę mięśniową z dietą dopasowaną do Ciebie",
  reduction: "Schudnij skutecznie z dietą dopasowaną do Ciebie",
  maintenance: "Utrzymaj wagę z dietą dopasowaną do Ciebie",
};

const GOAL_BENEFITS: Record<DietGoal, string[]> = {
  mass: ["Wysokokaloryczne posiłki", "Optymalne białko", "Lista zakupów"],
  reduction: ["Deficyt kaloryczny", "Sycące posiłki", "Bez efektu jo-jo"],
  maintenance: ["Zbilansowane makra", "Elastyczny plan", "Zdrowe nawyki"],
};

export default function DietOnlineCTA({ goal, variant = "default" }: DietOnlineCTAProps) {
  const title = goal ? GOAL_TITLES[goal] : "TWOJA DIETA ONLINE";
  const subtitle = goal ? GOAL_SUBTITLES[goal] : "W 60 sekund za darmo otrzymasz gotową dietę";
  const benefits = goal ? GOAL_BENEFITS[goal] : ["Lista zakupów", "Przepisy na dania", "Kalorie policzone"];

  const features = [
    { icon: pc, text: "100% ONLINE" },
    { icon: clock, text: "BEZ LIMITU" },
    { icon: hat, text: "OD DIETETYKÓW" },
  ];

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-[#e77503] to-[#ff9a3c] rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-montserrat font-bold text-xl mb-2">{title}</h3>
            <p className="text-white/90 text-sm mb-4">{subtitle}</p>
            <div className="flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <span key={benefit} className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs">
                  <FaCheck className="text-[10px]" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/generator-diety-ai"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#e77503] rounded-full px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <span>Rozpocznij</span>
            <FaPlay className="text-sm" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/herovid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 py-12 px-6 text-center">
        <h2 className="text-white drop-shadow-lg text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight font-montserrat tracking-wide">
          {title}
        </h2>
        <p className="text-white/90 text-sm sm:text-base mb-6 max-w-md mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2 px-4 py-2 bg-[#e77503] text-white rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg text-sm"
            >
              <div className="w-4 h-4 rounded-full bg-[#fcaa30] flex items-center justify-center">
                <FaCheck className="text-white text-[8px]" />
              </div>
              {benefit}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
          {features.map((feature) => (
            <div key={feature.text} className="flex flex-col items-center space-y-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFF3E0] rounded-2xl flex items-center justify-center shadow-lg">
                <Image
                  src={feature.icon}
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <span className="text-white text-xs sm:text-sm font-medium text-center leading-tight">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/generator-diety-ai"
          className="inline-flex items-center space-x-3 bg-[#e77503] hover:bg-[#e77503]/80 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
        >
          <span>Rozpocznij</span>
          <FaPlay className="text-sm" />
        </Link>
      </div>
    </div>
  );
}
