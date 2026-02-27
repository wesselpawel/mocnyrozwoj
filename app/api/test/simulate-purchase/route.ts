import { NextResponse } from "next/server";
import { userPurchasesService } from "@/lib/userPurchasesService";
import { updateDocument, getDocument } from "@/firebase";

export async function POST(req: Request) {
  try {
    const { userId, courseId, courseTitle } = await req.json();

    if (!userId || !courseId || !courseTitle) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: userId, courseId, courseTitle",
      });
    }

    // Add the purchase to user_purchases collection
    const purchaseId = await userPurchasesService.addPurchase({
      userId,
      courseId,
      courseTitle,
      purchaseDate: new Date().toISOString(),
      amount: 99.99,
      currency: "PLN",
      transactionId: `test-${Date.now()}`,
      status: "completed",
    });

    // Update user purchase statistics
    await userPurchasesService.updateUserPurchaseStats(userId);

    // Add course to user's purchasedCourses array
    const userDoc = await getDocument("users", userId);
    const currentPurchasedCourses = userDoc?.purchasedCourses || [];

    if (!currentPurchasedCourses.includes(courseId)) {
      await updateDocument(
        ["purchasedCourses", "updatedAt"],
        [[...currentPurchasedCourses, courseId], new Date().toISOString()],
        "users",
        userId
      );
    }

    // Verify the update
    const updatedUserDoc = await getDocument("users", userId);
    const userPurchases = await userPurchasesService.getUserPurchases(userId);

    return NextResponse.json({
      success: true,
      purchaseId,
      userPurchases,
      updatedUser: updatedUserDoc,
      purchasedCourses: updatedUserDoc?.purchasedCourses || [],
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
