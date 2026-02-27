"use client";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();

  function emailPasswordLogin() {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // Basic validation
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Wpisz poprawny adres email");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Success - user will be redirected by the layout
        router.push("/admin");
      })
      .catch((error: { code?: string }) => {
        setIsLoading(false);

        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            setGeneralError("Niepoprawne dane logowania");
            break;
          case "auth/invalid-email":
            setEmailError("Niepoprawny format adresu email");
            break;
          case "auth/too-many-requests":
            setGeneralError(
              "Zbyt wiele prób logowania. Spróbuj ponownie później.",
            );
            break;
          case "auth/network-request-failed":
            setGeneralError(
              "Problem z połączeniem. Sprawdź połączenie internetowe.",
            );
            break;
          default:
            setGeneralError(
              "Wystąpił błąd podczas logowania. Spróbuj ponownie.",
            );
        }

        // Clear errors after 5 seconds
        setTimeout(() => {
          setEmailError("");
          setPasswordError("");
          setGeneralError("");
        }, 5000);
      });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailPasswordLogin();
  };

  return (
    <div className="relative flex flex-col h-screen justify-center items-center bg-gray-100 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-sm p-6 bg-white rounded-lg shadow-md relative z-50"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Panel administracyjny
        </h2>

        <label className="text-gray-700 font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`text-black border p-2 mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
            emailError ? "border-red-500" : "border-gray-400"
          }`}
          placeholder="admin@example.com"
          type="email"
          required
          disabled={isLoading}
        />
        {emailError && (
          <p className="text-red-500 text-sm mb-2">{emailError}</p>
        )}

        <label className="text-gray-700 font-bold mb-2" htmlFor="password">
          Hasło
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`text-black border p-2 mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
            passwordError ? "border-red-500" : "border-gray-400"
          }`}
          placeholder="Hasło"
          required
          disabled={isLoading}
        />
        {passwordError && (
          <p className="text-red-500 text-sm mb-4">{passwordError}</p>
        )}

        {generalError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {generalError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-400 hover:bg-green-500"
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logowanie...
            </div>
          ) : (
            "Zaloguj się"
          )}
        </button>
      </form>

      <h1 className="text-center text-2xl py-12 bg-green-400 text-white px-3 rounded-b-xl relative z-50">
        Quixy Admin v1.0
      </h1>

      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400 via-blue-500 to-red-500 opacity-25"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-400 via-blue-500 to-red-500 opacity-25"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400 via-blue-500 to-red-500 opacity-25 transform rotate-45"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-400 via-blue-500 to-red-500 opacity-25 transform -rotate-45"></div>
    </div>
  );
}
