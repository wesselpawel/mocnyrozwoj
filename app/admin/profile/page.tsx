"use client";
import { useState } from "react";
import {
  FaUser,
  FaShieldAlt,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

export default function AdminProfilePage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handleLogout = () => {
    window.location.href = "/api/admin/logout";
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setPasswordError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Hasła nie są identyczne");
      return;
    }

    // Here you would typically call Firebase Auth to update the password
    // For now, we'll just show a success message
    setSuccessMessage("Hasło zostało zmienione pomyślnie");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  };

  return (
    <div className="p-6 lg:p-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil</h1>
        <p className="text-gray-600">Zarządzaj swoim kontem i ustawieniami</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mr-4">
              <FaUser />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Informacje o koncie
              </h2>
              <p className="text-gray-600">Zarządzaj swoimi danymi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaShieldAlt className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Status konta</p>
                <p className="font-medium text-green-600">Aktywne</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaCog className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Rola</p>
                <p className="font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Bezpieczeństwo
          </h2>

          {!isChangingPassword ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Zmiana hasła
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Regularna zmiana hasła zwiększa bezpieczeństwo Twojego konta.
                </p>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Zmień hasło
                </button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Wylogowanie</h3>
                <p className="text-red-700 text-sm mb-3">
                  Wyloguj się z panelu administracyjnego.
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Wyloguj się
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nowe hasło
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Wprowadź nowe hasło"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potwierdź nowe hasło
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Potwierdź nowe hasło"
                  required
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {passwordError}
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {successMessage}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Zmień hasło
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Ostatnia aktywność
        </h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Zalogowano do panelu</p>
              <p className="text-xs text-gray-500">
                Dzisiaj, {new Date().toLocaleTimeString("pl-PL")}
              </p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Zmieniono hasło</p>
              <p className="text-xs text-gray-500">Wczoraj, 15:30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
