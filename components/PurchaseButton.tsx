import React, { useState } from "react";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import GuestCheckoutModal from "./GuestCheckoutModal";

interface PurchaseButtonProps {
  item: {
    id: string;
    title: string;
    price: number;
    type: "course" | "diet";
    data?: Record<string, unknown>;
  };
  variant?: "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
}

export default function PurchaseButton({
  item,
  variant = "primary",
  className,
  children,
}: PurchaseButtonProps) {
  const { handlePurchase, isLoading, isLoggedIn } = usePurchaseFlow();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const baseClasses = {
    primary:
      "text-center block w-full bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105",
  };

  const buttonClassName = className || baseClasses[variant];

  const handleClick = async () => {
    if (isLoggedIn) {
      // User is logged in, proceed directly
      await handlePurchase(item);
    } else {
      // User is not logged in, show guest checkout modal
      setShowGuestModal(true);
    }
  };

  const handleGuestPurchase = async (guestEmail: string) => {
    setShowGuestModal(false);
    await handlePurchase(item, guestEmail);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={buttonClassName}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Przetwarzanie...
          </div>
        ) : (
          children || "Kup teraz"
        )}
      </button>

      <GuestCheckoutModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onPurchase={handleGuestPurchase}
        item={item}
      />
    </>
  );
}
