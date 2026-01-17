"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/firebase";
import { useRouter } from "next/navigation";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLoginMode) {
        // Login logic
        if (formData.email && formData.password) {
          await signInWithEmail(formData.email, formData.password);
          onClose();
          router.push("/dashboard");
        } else {
          setError("Proszę wypełnić wszystkie pola");
        }
      } else {
        // Register logic
        if (formData.email && formData.password && formData.name) {
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
          };

          // Create user in Firestore
          await createUserInFirestore(userData);

          login(userData);
          onClose();
          router.push("/dashboard");
        } else {
          setError("Proszę wypełnić wszystkie pola");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.code === "auth/user-not-found") {
        setError("Użytkownik nie został znaleziony");
      } else if (error.code === "auth/wrong-password") {
        setError("Nieprawidłowe hasło");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email jest już używany");
      } else if (error.code === "auth/weak-password") {
        setError("Hasło jest za słabe (minimum 6 znaków)");
      } else if (error.code === "auth/invalid-email") {
        setError("Nieprawidłowy format email");
      } else {
        setError("Wystąpił błąd podczas logowania");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { signInWithGoogle, createUserInFirestore } = await import(
        "@/firebase"
      );
      const userCredential = await signInWithGoogle();

      if (userCredential) {
        // Create user profile
        const userData = {
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
          name:
            userCredential.user.displayName ||
            userCredential.user.email?.split("@")[0] ||
            "Użytkownik",
          subscriptionStatus: "free" as const,
        };

        // Create user in Firestore
        await createUserInFirestore(userData);

        login(userData);
        onClose();
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        setError("Logowanie zostało anulowane");
      } else if (error.code === "auth/popup-blocked") {
        setError(
          "Wyskakujące okno zostało zablokowane. Sprawdź ustawienia przeglądarki."
        );
      } else {
        setError("Błąd logowania przez Google");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
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
                <h2 className="text-2xl font-bold text-center">
                  {isLoginMode ? "Zaloguj się" : "Zarejestruj się"}
                </h2>
                <p className="text-white/80 text-center mt-2">
                  {isLoginMode
                    ? "Zaloguj się, aby kontynuować"
                    : "Utwórz konto, aby rozpocząć"}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 mb-6"
                >
                  <FaGoogle className="text-red-500" />
                  <span>Kontynuuj z Google</span>
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">lub</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLoginMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imię i nazwisko
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="!text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        placeholder="Wprowadź swoje imię i nazwisko"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="!text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        placeholder="Wprowadź swój email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hasło
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="!text-black w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        placeholder="Wprowadź swoje hasło"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isLoginMode ? "Logowanie..." : "Rejestracja..."}
                      </div>
                    ) : isLoginMode ? (
                      "Zaloguj się"
                    ) : (
                      "Zarejestruj się"
                    )}
                  </button>
                </form>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setError("");
                      setFormData({ email: "", password: "", name: "" });
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    {isLoginMode
                      ? "Nie masz konta? Zarejestruj się"
                      : "Masz już konto? Zaloguj się"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
