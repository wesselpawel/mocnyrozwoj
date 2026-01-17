"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  auth,
  onAuthStateChanged,
  logout,
  createUserInFirestore,
} from "@/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Convert Firebase user to our User interface
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Użytkownik",
          subscriptionStatus: "free",
          totalPurchases: 0,
          totalSpent: 0,
          purchasedCourses: [],
        };

        // Ensure user exists in Firestore
        try {
          await createUserInFirestore(userData);
        } catch (error) {
          console.error("Error creating user in Firestore:", error);
        }

        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, login, logout: handleLogout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
