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

const normalizeSubscriptionStatus = (
  value: unknown,
): User["subscriptionStatus"] => {
  const normalized = String(value || "free").toLowerCase();
  if (normalized === "basic") return "basic" as User["subscriptionStatus"];
  if (normalized === "advanced") return "advanced" as User["subscriptionStatus"];
  if (normalized === "pro") return "pro" as User["subscriptionStatus"];
  if (normalized === "premium") return "premium";
  return "free";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Convert Firebase user to our User interface.
        const fallbackUserData: User = {
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

        // Ensure user exists and always read current profile from Firestore.
        try {
          const firestoreUser = await createUserInFirestore(fallbackUserData);
          const rawUser = (firestoreUser || {}) as Record<string, unknown>;
          const mergedUser: User = {
            ...fallbackUserData,
            ...(firestoreUser || {}),
            id: (rawUser.id as string) || fallbackUserData.id,
            email: (rawUser.email as string) || fallbackUserData.email,
            name: (rawUser.name as string) || fallbackUserData.name,
            subscriptionStatus: normalizeSubscriptionStatus(
              rawUser.subscriptionStatus,
            ),
            totalPurchases:
              typeof rawUser.totalPurchases === "number"
                ? rawUser.totalPurchases
                : fallbackUserData.totalPurchases,
            totalSpent:
              typeof rawUser.totalSpent === "number"
                ? rawUser.totalSpent
                : fallbackUserData.totalSpent,
            purchasedCourses: Array.isArray(rawUser.purchasedCourses)
              ? (rawUser.purchasedCourses as string[])
              : fallbackUserData.purchasedCourses,
            subscriptionEndDate:
              typeof rawUser.subscriptionEndDate === "string"
                ? rawUser.subscriptionEndDate
                : undefined,
            lastPurchaseDate:
              typeof rawUser.lastPurchaseDate === "string"
                ? rawUser.lastPurchaseDate
                : undefined,
            createdAt:
              typeof rawUser.createdAt === "string"
                ? rawUser.createdAt
                : undefined,
            updatedAt:
              typeof rawUser.updatedAt === "string"
                ? rawUser.updatedAt
                : undefined,
          };
          setUser(mergedUser);
        } catch {
          setUser(fallbackUserData);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const handlelogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch {
      // logout failed
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, login, logout: handlelogout, updateUser }}
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
