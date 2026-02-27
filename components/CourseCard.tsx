import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaClock, FaStar, FaUsers, FaCheck } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "./AuthContext";
import LoginPopup from "./LoginPopup";
import { trackBeginCheckout } from "@/lib/conversionTracking";
import PurchaseButton from "./PurchaseButton";

interface DietPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Początkujący" | "Średniozaawansowany" | "Zaawansowany";
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  lessons: number;
  isPopular?: boolean;
  isNew?: boolean;
}

interface DietPlanCardProps {
  course: DietPlan;
  variant?: "default" | "compact" | "horizontal";
  onClick?: () => void;
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({
  course,
  variant = "default",
  onClick,
}) => {
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Placeholder for future functionality
  const handleBuyClick = () => {
    // Buy button click handler
  };

  const handlePlayClick = () => {
    if (user) {
      // Check if user owns this diet plan
      if (user?.purchasedCourses?.includes(course.id)) {
        if (onClick) onClick();
      } else {
        // User doesn't own the diet plan, trigger purchase
        handlePurchase();
      }
    } else {
      setShowLoginPopup(true);
    }
  };

  const handlePurchase = async () => {
    try {
      // Track begin checkout event
      trackBeginCheckout(course.price, "PLN", [
        {
          item_id: course.id,
          item_name: course.title,
          price: course.price,
          quantity: 1,
        },
      ]);

      // Create Stripe checkout session
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: course.id,
            courseTitle: course.title,
            coursePrice: course.price,
            userEmail: user?.email,
            userId: user?.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch {
      // Purchase handling failed
    }
  };
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Początkujący":
        return "bg-green-100 text-green-800";
      case "Średniozaawansowany":
        return "bg-yellow-100 text-yellow-800";
      case "Zaawansowany":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const cardContent = (
    <>
      {/* Diet Plan Image */}
      <div className="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={false}
            quality={85}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        {course.isPopular && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold">
            Popularny
          </div>
        )}
        {course.isNew && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-1 rounded-full text-xs font-bold">
            Nowy
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {user?.purchasedCourses?.includes(course.id) && (
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer">
              <FaCheck className="text-white text-lg lg:text-xl" />
            </div>
          )}
        </div>

        {/* Ownership indicator */}
        {user?.purchasedCourses?.includes(course.id) && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Zakupiony
          </div>
        )}
        {/* Diet Plan Content */}
        <div className="p-3 lg:p-6 absolute bottom-0 left-0 w-full h-max bg-black/50 justify-center items-start flex flex-col">
          <div className="flex items-center justify-between mb-2 lg:mb-3"></div>

          <h3 className="text-sm lg:text-lg font-bold text-white mb-2 transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Diet Plan Stats */}
          <div className="flex items-center justify-between mb-3 lg:mb-4 w-full">
            <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-white">
              <div className="flex items-center">
                <FaClock className="mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <FaUsers className="mr-1" />
                <span>{course.students}</span>
              </div>
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-xs lg:text-sm font-medium text-white">
                {course.rating}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <span className="text-lg lg:text-2xl font-bold text-white">
                {course.price} PLN
              </span>
              {course.originalPrice && (
                <span className="text-xs lg:text-sm text-white line-through">
                  {course.originalPrice} PLN
                </span>
              )}
            </div>
            <PurchaseButton
              item={{
                id: course.id,
                title: course.title,
                price: course.price,
                type: "course",
              }}
              variant="secondary"
            >
              Kup teraz
            </PurchaseButton>
          </div>
        </div>
      </div>
    </>
  );

  if (variant === "horizontal") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex"
      >
        <div className="w-1/3">
          <div className="relative h-full bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
            {course.image ? (
              <Image
                src={course.image}
                alt={course.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={false}
                quality={85}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
            {course.isPopular && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                Popularny
              </div>
            )}
          </div>
        </div>
        <div className="w-2/3 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              {course.category}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(
                course.level
              )}`}
            >
              {course.level}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="flex items-center">
                <FaClock className="mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{course.rating}</span>
              </div>
            </div>
            <button
              onClick={handleBuyClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              {course.price} PLN
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
          variant === "compact" ? "max-w-xs" : ""
        }`}
      >
        {cardContent}
      </motion.div>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
};

export default DietPlanCard;
