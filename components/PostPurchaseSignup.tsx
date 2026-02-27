import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaGift,
} from "react-icons/fa";
import {
  PurchaseSessionManager,
  PurchaseSession,
} from "@/lib/purchaseSessionManager";
import { useAuth } from "@/components/AuthContext";

interface PostPurchaseSignupProps {
  purchaseSession: PurchaseSession;
  onComplete: () => void;
}

export default function PostPurchaseSignup({
  purchaseSession,
  onComplete,
}: PostPurchaseSignupProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: purchaseSession.guestEmail || "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Proszę podać imię");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Proszę podać adres email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Proszę podać prawidłowy adres email");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są identyczne");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Create user account
      const { signUpWithEmail, createUserInFirestore } = await import(
        "@/firebase"
      );
      const userCredential = await signUpWithEmail(
        formData.email,
        formData.password
      );

      // Create user profile
      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
        name: formData.name,
        subscriptionStatus: "free" as const,
        totalPurchases: 1,
        totalSpent: purchaseSession.productPrice,
        purchasedCourses: [purchaseSession.productId],
      };

      // Create user in Firestore
      await createUserInFirestore(userData);

      // Transfer guest purchases to the new user
      await PurchaseSessionManager.transferPurchasesToUser(userData.id);

      // Update the purchase in the database to associate it with the new user
      try {
        const response = await fetch("/api/transfer-guest-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.id,
            guestSessionId: purchaseSession.sessionId,
            purchaseData: {
              productId: purchaseSession.productId,
              productTitle: purchaseSession.productTitle,
              productPrice: purchaseSession.productPrice,
              productType: purchaseSession.productType,
            },
          }),
        });

        if (!response.ok) {
          // Transfer failed, continue anyway
        }
      } catch {
        // Don't fail the entire process if transfer fails
      }

      // Log the user in
      login(userData);

      // Show success message
      setShowSuccess(true);

      // Redirect to dashboard after a delay
      setTimeout(() => {
        onComplete();
        router.push("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === "auth/email-already-in-use") {
        setError("Ten adres email jest już używany. Spróbuj się zalogować.");
      } else if (err.code === "auth/weak-password") {
        setError("Hasło jest zbyt słabe. Użyj co najmniej 6 znaków.");
      } else if (err.code === "auth/invalid-email") {
        setError("Nieprawidłowy adres email.");
      } else {
        setError("Wystąpił błąd podczas tworzenia konta. Spróbuj ponownie.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Clear the session and redirect to dashboard
    PurchaseSessionManager.clearSession();
    onComplete();
    router.push("/dashboard");
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Konto utworzone pomyślnie!
          </h2>
          <p className="text-gray-600 mb-4">
            Twoje konto zostało utworzone i zakup został przypisany do Twojego
            profilu.
          </p>
          <div className="flex items-center justify-center text-sm text-purple-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
            Przekierowanie do dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGift className="text-purple-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Utwórz konto i zabezpiecz zakup
            </h2>
            <p className="text-gray-600">
              Załóż konto, aby mieć stały dostęp do zakupionego produktu
            </p>
          </div>
        </div>

        {/* Purchase Info */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="font-semibold text-gray-800 mb-2">
            Zakupiony produkt:
          </h3>
          <div className="bg-white p-3 rounded-lg">
            <div className="font-medium text-gray-800">
              {purchaseSession.productTitle}
            </div>
            <div className="text-sm text-gray-600">
              {purchaseSession.productType === "course"
                ? "Kurs"
                : "Plan dietetyczny"}
            </div>
            <div className="text-lg font-bold text-purple-600 mt-1">
              {purchaseSession.productPrice} PLN
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-gray-400" />
                Imię
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Twoje imię"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-gray-400" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="twoj@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-gray-400" />
                Hasło
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Co najmniej 6 znaków"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-gray-400" />
                Potwierdź hasło
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Powtórz hasło"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Tworzenie konta...
                  </div>
                ) : (
                  "Utwórz konto"
                )}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm transition-colors"
              >
                Pomiń i przejdź do dashboard
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              💡 Dzięki kontu będziesz mieć stały dostęp do swoich zakupów i
              będziesz mógł śledzić postępy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
