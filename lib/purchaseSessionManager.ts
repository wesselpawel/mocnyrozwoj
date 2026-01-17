// Session manager for guest purchases
export interface PurchaseSession {
  sessionId: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productType: "course" | "diet";
  timestamp: number;
  guestEmail?: string;
  completed: boolean;
}

export class PurchaseSessionManager {
  private static SESSION_KEY = "purchase_session";
  private static GUEST_PURCHASES_KEY = "guest_purchases";

  // Create a new purchase session for guests
  static createGuestSession(
    productId: string,
    productTitle: string,
    productPrice: number,
    productType: "course" | "diet",
    guestEmail?: string
  ): string {
    const sessionId = `guest_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const session: PurchaseSession = {
      sessionId,
      productId,
      productTitle,
      productPrice,
      productType,
      timestamp: Date.now(),
      guestEmail,
      completed: false,
    };

    // Store session in localStorage
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    // Also add to guest purchases history
    this.addToGuestPurchases(session);

    return sessionId;
  }

  // Get current purchase session
  static getCurrentSession(): PurchaseSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  }

  // Mark session as completed
  static completeSession(stripeSessionId: string): void {
    const session = this.getCurrentSession();
    if (session) {
      session.completed = true;
      session.sessionId = stripeSessionId; // Update with actual Stripe session ID
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

      // Update in guest purchases
      this.updateGuestPurchase(session);
    }
  }

  // Clear current session
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Get all guest purchases
  static getGuestPurchases(): PurchaseSession[] {
    try {
      const purchases = localStorage.getItem(this.GUEST_PURCHASES_KEY);
      return purchases ? JSON.parse(purchases) : [];
    } catch {
      return [];
    }
  }

  // Add purchase to guest history
  private static addToGuestPurchases(session: PurchaseSession): void {
    const purchases = this.getGuestPurchases();
    purchases.push(session);
    localStorage.setItem(this.GUEST_PURCHASES_KEY, JSON.stringify(purchases));
  }

  // Update guest purchase
  private static updateGuestPurchase(updatedSession: PurchaseSession): void {
    const purchases = this.getGuestPurchases();
    const index = purchases.findIndex(
      (p) =>
        p.productId === updatedSession.productId &&
        p.timestamp === updatedSession.timestamp
    );
    if (index !== -1) {
      purchases[index] = updatedSession;
      localStorage.setItem(this.GUEST_PURCHASES_KEY, JSON.stringify(purchases));
    }
  }

  // Transfer guest purchases to user account
  static async transferPurchasesToUser(
    userId: string
  ): Promise<PurchaseSession[]> {
    const guestPurchases = this.getGuestPurchases().filter((p) => p.completed);

    if (guestPurchases.length > 0) {
      try {
        // Clear guest purchases after transfer
        localStorage.removeItem(this.GUEST_PURCHASES_KEY);
        localStorage.removeItem(this.SESSION_KEY);

        return guestPurchases;
      } catch (error) {
        console.error("Error transferring guest purchases:", error);
        return [];
      }
    }

    return [];
  }

  // Check if there are completed guest purchases
  static hasCompletedGuestPurchases(): boolean {
    return this.getGuestPurchases().some((p) => p.completed);
  }
}
