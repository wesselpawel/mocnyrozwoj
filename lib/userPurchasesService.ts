import {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
} from "@/firebase";

interface UserPurchase {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  purchaseDate: string;
  amount: number;
  currency: string;
  transactionId: string;
  status: "completed" | "pending" | "failed";
  stripeSessionId?: string;
  expiresAt?: string; // For subscription-based access
  type?: "course" | "diet" | "subscription"; // Type of purchase
  transferredFromGuest?: boolean; // Indicates if purchase was transferred from guest session
}

const COLLECTION_NAME = "user_purchases";

export const userPurchasesService = {
  // Add a new purchase record
  async addPurchase(purchaseData: Omit<UserPurchase, "id">): Promise<string> {
    // Validate that userId is provided and not null/undefined
    if (
      !purchaseData.userId ||
      purchaseData.userId === "null" ||
      purchaseData.userId === "undefined"
    ) {
      throw new Error(
        `Invalid userId provided: ${purchaseData.userId}. Cannot create purchase record without valid user ID.`
      );
    }

    const id = Date.now().toString();
    const purchase: UserPurchase = {
      ...purchaseData,
      id,
    };

    console.log("Adding purchase to database:", purchase);

    try {
      await addDocument(COLLECTION_NAME, id, purchase);
      console.log(`Purchase saved successfully with ID: ${id}`);
      return id;
    } catch (error) {
      console.error("Error saving purchase to Firestore:", error);
      throw error;
    }
  },

  // Get all purchases for a user
  async getUserPurchases(userId: string): Promise<UserPurchase[]> {
    const purchases = await getDocuments(COLLECTION_NAME);
    const userPurchases = (purchases as UserPurchase[]).filter(
      (purchase) => purchase.userId === userId
    );
    if (userPurchases.length > 0) {
      console.log(
        "User purchases found for user:",
        userId,
        "Count:",
        userPurchases.length
      );
    }
    return userPurchases;
  },

  // Update user purchase statistics
  async updateUserPurchaseStats(userId: string): Promise<void> {
    try {
      const userPurchases = await this.getUserPurchases(userId);
      const completedPurchases = userPurchases.filter(
        (p) => p.status === "completed"
      );

      const totalPurchases = completedPurchases.length;
      const totalSpent = completedPurchases.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const lastPurchaseDate =
        completedPurchases.length > 0
          ? completedPurchases.sort(
              (a, b) =>
                new Date(b.purchaseDate).getTime() -
                new Date(a.purchaseDate).getTime()
            )[0].purchaseDate
          : null;

      // Update user document with purchase statistics
      const updateData = {
        totalPurchases,
        totalSpent,
        lastPurchaseDate,
        updatedAt: new Date().toISOString(),
      };

      const keys = Object.keys(updateData);
      const values = Object.values(updateData);

      await updateDocument(keys, values, "users", userId);
      console.log(`Updated user ${userId} purchase stats:`, updateData);
    } catch (error) {
      console.error("Error updating user purchase stats:", error);
      throw error;
    }
  },

  // Get user document from users collection
  async getUserDocument(userId: string): Promise<any> {
    try {
      const userDoc = await getDocument("users", userId);
      return userDoc;
    } catch (error) {
      console.error("Error getting user document:", error);
      return null;
    }
  },
};
