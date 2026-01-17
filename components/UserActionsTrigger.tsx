"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import UserActionsModal from "./UserActionsModal";

export default function UserActionsTrigger() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center"
      >
        <FaUser className="text-xl" />
      </motion.button>

      <UserActionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
