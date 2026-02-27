"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, firebaseUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // If user is already logged in, redirect them immediately
  useEffect(() => {
    if (firebaseUser) {
      router.replace(redirectTo);
    }
  }, [firebaseUser, router, redirectTo]);

  useEffect(() => {
    // If user is already logged in, redirect them
    if (firebaseUser) {
      router.push(redirectTo);
    }
  }, [firebaseUser, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Handle login
        const { signInWithEmail } = await import("@/firebase");
        await signInWithEmail(email, password);
        setSuccess("Zalogowano pomyślnie!");
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } else {
        // Handle registration
        const { signUpWithEmail, createUserInFirestore } = await import(
          "@/firebase"
        );
        const userCredential = await signUpWithEmail(email, password);

        // Create user profile
        const userData = {
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
          name: email.split("@")[0],
          subscriptionStatus: "free" as const,
        };

        // Create user in Firestore
        await createUserInFirestore(userData);

        login(userData);
        setSuccess("Konto utworzone pomyślnie!");
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      }
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code?: string })?.code ?? ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { signInWithGoogle, createUserInFirestore } = await import(
        "@/firebase"
      );
      const userCredential = await signInWithGoogle();

      if (userCredential) {
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
        setSuccess("Zalogowano pomyślnie!");
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      }
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code?: string })?.code ?? ""));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Nie znaleziono użytkownika z tym adresem email.";
      case "auth/wrong-password":
        return "Nieprawidłowe hasło.";
      case "auth/email-already-in-use":
        return "Ten adres email jest już używany.";
      case "auth/weak-password":
        return "Hasło jest za słabe. Użyj co najmniej 6 znaków.";
      case "auth/invalid-email":
        return "Nieprawidłowy adres email.";
      case "auth/too-many-requests":
        return "Zbyt wiele prób logowania. Spróbuj ponownie później.";
      default:
        return "Wystąpił błąd podczas logowania. Spróbuj ponownie.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Witaj ponownie!" : "Utwórz konto"}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? "Zaloguj się, aby kontynuować"
              : "Dołącz do nas i rozpocznij swoją podróż rozwoju"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6"
          >
            <FaGoogle className="mr-3 text-red-500" />
            {isLogin ? "Zaloguj się z Google" : "Zarejestruj się z Google"}
          </button>

          {/* Divider */}
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
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Adres email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="!text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="twoj@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Hasło
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="!text-black w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
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

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Logowanie..." : "Rejestracja..."}
                </div>
              ) : isLogin ? (
                "Zaloguj się"
              ) : (
                "Utwórz konto"
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Nie masz jeszcze konta?" : "Masz już konto?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
              >
                {isLogin ? "Zarejestruj się" : "Zaloguj się"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Wróć do strony głównej
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
