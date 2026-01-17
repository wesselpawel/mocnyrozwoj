import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBullseye,
  FaDumbbell,
  FaStar,
  FaTools,
  FaTrophy,
} from "react-icons/fa";

const Advertisement: React.FC = () => {
  const advertisementItems = [
    {
      id: 1,
      title: "Odkryj siebie",
      description: "Poznaj swoje mocne strony i obszary do rozwoju",
      icon: <FaBullseye />,
      gradient: "from-blue-400 to-purple-400",
      bgGradient: "from-blue-50 to-purple-50",
    },
    {
      id: 2,
      title: "Buduj pewność",
      description: "Rozwijaj swoją samoocenę i pewność siebie",
      icon: <FaDumbbell />,
      gradient: "from-green-400 to-blue-400",
      bgGradient: "from-green-50 to-blue-50",
    },
    {
      id: 3,
      title: "Osiągnij cele",
      description: "Realizuj swoje marzenia i cele życiowe",
      icon: <FaStar />,
      gradient: "from-pink-400 to-red-400",
      bgGradient: "from-pink-50 to-red-50",
    },
    {
      id: 4,
      title: "Każdy dzień to nowa szansa",
      description:
        "Nie czekaj na idealny moment. Rozpocznij swoją transformację już dziś.",
      icon: <FaStar />,
      gradient: "from-yellow-400 to-orange-400",
      bgGradient: "from-yellow-50 to-orange-50",
    },
    {
      id: 5,
      title: "Narzędzia, które działają",
      description:
        "Sprawdzone metody i techniki, które pomogą Ci osiągnąć sukces.",
      icon: <FaTools />,
      gradient: "from-indigo-400 to-purple-400",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    {
      id: 6,
      title: "Historie sukcesu",
      description: "Ponad 10,000+ zadowolonych użytkowników",
      icon: <FaTrophy />,
      gradient: "from-emerald-400 to-teal-400",
      bgGradient: "from-emerald-50 to-teal-50",
    },
  ];

  return <></>;
};

export default Advertisement;
