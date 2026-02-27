"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTimes, FaUser, FaBook, FaSignOutAlt, FaCrown } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { logout } from "@/firebase";

interface UserActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserActionsModal({
  isOpen,
  onClose,
}: UserActionsModalProps) {
  const { user, firebaseUser } = useAuth();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "free" | "premium"
  >("free");

  // Check subscription status from Firebase
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (user?.id) {
        try {
          // Here you would typically check the user's subscription status from your database
          // For now, we'll use the user's subscriptionStatus from AuthContext
          setSubscriptionStatus(user.subscriptionStatus);
        } catch {
          // Subscription status check failed
        }
      }
    };

    checkSubscriptionStatus();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      router.push("/login");
    } catch {
      // Logout failed
    }
  };

  const handleProfileClick = () => {
    onClose();
    // Navigate to profile page or dashboard
    router.push("/dashboard");
  };

  const handleCoursesClick = () => {
    onClose();
    // Navigate to my courses
    router.push("/dashboard/my-courses");
  };

  const userActions = [
    {
      id: "profile",
      icon: <FaUser className="text-lg" />,
      text: "Mój profil",
      action: handleProfileClick,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "courses",
      icon: <FaBook className="text-lg" />,
      text: "Moje kursy",
      action: handleCoursesClick,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "logout",
      icon: <FaSignOutAlt className="text-lg" />,
      text: "Wyloguj się",
      action: handleLogout,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 lg:inset-8 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-white/80 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="p-6">
                <div className="space-y-3">
                  {userActions.map((action) => (
                    <motion.button
                      key={action.id}
                      onClick={action.action}
                      className={`w-full p-4 rounded-xl transition-all duration-300 ${action.bgColor} hover:bg-opacity-80`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex items-center space-x-3 ${action.color}`}
                      >
                        {action.icon}
                        <span className="font-medium">{action.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Subscription Status */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          subscriptionStatus === "premium"
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <FaCrown
                          className={`text-lg ${
                            subscriptionStatus === "premium"
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Status subskrypcji
                        </h3>
                        <p
                          className={`text-sm capitalize ${
                            subscriptionStatus === "premium"
                              ? "text-yellow-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {subscriptionStatus === "premium"
                            ? "Premium"
                            : "Darmowa"}
                        </p>
                      </div>
                    </div>
                    {subscriptionStatus === "free" && (
                      <button
                        onClick={() => {
                          onClose();
                          router.push("/dashboard");
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
