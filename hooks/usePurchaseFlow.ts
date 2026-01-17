import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { PurchaseSessionManager } from "@/lib/purchaseSessionManager";
import { trackBeginCheckout } from "@/lib/conversionTracking";

interface PurchaseItem {
  id: string;
  title: string;
  price: number;
  type: "course" | "diet";
  data?: any; // Additional data for diets
}

export const usePurchaseFlow = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (item: PurchaseItem, guestEmail?: string) => {
    try {
      setIsLoading(true);

      // Track begin checkout event
      trackBeginCheckout(item.price, "PLN", [
        {
          item_id: item.id,
          item_name: item.title,
          price: item.price,
          quantity: 1,
        },
      ]);

      let sessionId: string | null = null;

      // If user is not logged in, create a guest session
      if (!user) {
        sessionId = PurchaseSessionManager.createGuestSession(
          item.id,
          item.title,
          item.price,
          item.type,
          guestEmail
        );
      }

      // Determine the endpoint based on item type
      const endpoint =
        item.type === "diet"
          ? "/api/stripe/diet-checkout"
          : "/api/stripe/checkout";

      // Prepare request body
      const requestBody =
        item.type === "diet"
          ? {
              dietId: item.id,
              dietTitle: item.title,
              dietPrice: item.price,
              userEmail: user?.email || guestEmail,
              userId: user?.id || null,
              guestSessionId: sessionId,
              dietData: item.data,
            }
          : {
              courseId: item.id,
              courseTitle: item.title,
              coursePrice: item.price,
              userEmail: user?.email || guestEmail,
              userId: user?.id || null,
              guestSessionId: sessionId,
            };

      // Create Stripe checkout session
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error("Error creating checkout session:", data.error);
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error handling purchase:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handlePurchase,
    isLoading,
    isLoggedIn: !!user,
  };
};
