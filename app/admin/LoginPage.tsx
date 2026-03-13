"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("admin");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const configError = searchParams.get("error") === "config";

  async function login() {
    setUsernameError("");
    setPasswordError("");
    setGeneralError("");

    if (username.trim().length < 3) {
      setUsernameError("Wpisz poprawną nazwę użytkownika");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setGeneralError(
          payload?.error || "Wystąpił błąd podczas logowania. Spróbuj ponownie.",
        );
        return;
      }

      const nextPath = searchParams.get("next");
      const redirectPath =
        nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin";
      router.replace(redirectPath);
      router.refresh();
    } catch {
      setGeneralError("Problem z połączeniem. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (configError) {
      return;
    }
    void login();
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

        {configError && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded">
            Brak konfiguracji logowania. Ustaw w `.env.local` zmienne
            ADMIN_PASSWORD oraz opcjonalnie ADMIN_USERNAME i ADMIN_SESSION_SECRET.
          </div>
        )}

        <label className="text-gray-700 font-bold mb-2" htmlFor="username">
          Nazwa użytkownika
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`text-black border p-2 mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
            usernameError ? "border-red-500" : "border-gray-400"
          }`}
          placeholder="admin"
          type="text"
          required
          disabled={isLoading || configError}
        />
        {usernameError && (
          <p className="text-red-500 text-sm mb-2">{usernameError}</p>
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
          disabled={isLoading || configError}
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
          disabled={isLoading || configError}
          className={`py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
            isLoading || configError
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-400 hover:bg-green-500"
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              logowanie...
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
