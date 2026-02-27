import { NextResponse } from "next/server";
import { userPurchasesService } from "@/lib/userPurchasesService";
import { updateDocument, getDocument } from "@/firebase";

export async function POST(req: Request) {
  try {
    const { userId, guestSessionId, purchaseData } = await req.json();

    if (!userId || !guestSessionId || !purchaseData) {
      return NextResponse.json({
        success: false,
        error: "Missing required parameters",
      });
    }

    // Create a purchase record for the new user
    try {
      const purchaseId = await userPurchasesService.addPurchase({
        userId,
        courseId: purchaseData.productId,
        courseTitle: purchaseData.productTitle,
        purchaseDate: new Date().toISOString(),
        amount: purchaseData.productPrice,
        currency: "PLN",
        transactionId: guestSessionId,
        status: "completed",
        transferredFromGuest: true,
      });

      // Update user purchase statistics
      await userPurchasesService.updateUserPurchaseStats(userId);

      // Add the purchased item to user's purchased items array
      const userDoc = await getDocument("users", userId);
      const currentPurchasedCourses = userDoc?.purchasedCourses || [];

      if (!currentPurchasedCourses.includes(purchaseData.productId)) {
        await updateDocument(
          ["purchasedCourses", "updatedAt"],
          [
            [...currentPurchasedCourses, purchaseData.productId],
            new Date().toISOString(),
          ],
          "users",
          userId
        );
      }

      return NextResponse.json({
        success: true,
        message: "Guest purchase transferred successfully",
        purchaseId,
      });
    } catch {
      return NextResponse.json({
        success: false,
        error: "Failed to transfer purchase",
      });
    }
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
