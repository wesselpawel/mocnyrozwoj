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

export default function ProductDetails({
  product,
  setTest,
}: {
  product: any;
  setTest: (product: any) => void | Promise<void>;
}) {
  const features = [
    { icon: pc, text: "100% ONLINE", color: "from-blue-400 to-purple-400" },
    {
      icon: mug,
      text: "GOTOWE DO WYDRUKU",
      color: "from-green-400 to-blue-400",
    },
    { icon: clock, text: "BEZ LIMITU", color: "from-purple-400 to-pink-400" },
    {
      icon: calendar,
      text: "KIEDY CHCESZ",
      color: "from-orange-400 to-red-400",
    },
    {
      icon: hat,
      text: "OD DIETETYKÓW",
      color: "from-indigo-400 to-purple-400",
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
          <Image
            src={product?.mainImage}
            width={1024}
            height={1024}
            alt={product?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white drop-shadow-lg text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight"
          >
            {product.title}
          </motion.h2>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 max-w-4xl mx-auto"
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
                    className="filter brightness-0 invert"
                  />
                </div>
                <span className="text-white/90 text-xs md:text-sm font-medium text-center leading-tight">
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
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            <FaPlay className="text-sm" />
            <span>Kup plan dietetyczny</span>
            <FaArrowRight className="text-sm" />
          </motion.button>

          {/* Free Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <FaCheck className="text-green-300" />
            <span className="text-white/90 font-medium">PDF DO WYDRUKU</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
