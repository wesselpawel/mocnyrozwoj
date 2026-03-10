import { getPolishCurrency } from "@/lib/getPolishCurrency";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaClock,
  FaUsers,
  FaStar,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import hat from "../../public/hat.svg";
import calendar from "../../public/calendar.svg";
import mug from "../../public/mug.svg";
import pc from "../../public/pc.svg";
import clock from "../../public/clock.svg";

import { IProduct, Diet } from "@/types";

export default function ProductDetails({
  product,
  setTest,
  heroTitle = "TWOJA DIETA ONLINE",
}: {
  product: IProduct | Diet;
  setTest: (product: IProduct | Diet) => void | Promise<void>;
  heroTitle?: string;
}) {
  const imageSrc =
    "mainImage" in product
      ? product.mainImage || product.images[0]?.src || "/logoNew.png"
      : product.image;

  const features = [
    { icon: pc, text: "100% ONLINE", color: "from-[#FFF3E0] to-[#FFF3E0]" },

    { icon: clock, text: "BEZ LIMITU", color: "from-[#FFF3E0] to-[#FFF3E0]" },

    {
      icon: hat,
      text: "OD DIETETYKÓW",
      color: "from-[#FFF3E0] to-[#FFF3E0]",
    },
  ];

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12 relative overflow-hidden flex flex-col items-center justify-center rounded-3xl"
      >
        {/* Background Image with Overlay */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white drop-shadow-lg text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight font-montserrat"
          >
            {heroTitle}
          </motion.h2>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center space-y-3"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Image
                    src={feature.icon}
                    width={24}
                    height={24}
                    alt=""
                    className="text-zinc-800"
                  />
                </div>
                <span className="text-white text-xs md:text-sm font-medium text-center leading-tight">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTest(product)}
            className="inline-flex items-center space-x-3 bg-[#e77503] hover:bg-[#e77503]/80 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg transition-all duration-300"
          >
            <span>Rozpocznij</span>
            <FaPlay className="text-sm" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
