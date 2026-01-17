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

    console.log("Simulating course purchase:", {
      userId,
      courseId,
      courseTitle,
    });

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

    console.log("Purchase added with ID:", purchaseId);

    // Update user purchase statistics
    await userPurchasesService.updateUserPurchaseStats(userId);
    console.log("User purchase stats updated");

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
      console.log("Added course to user's purchasedCourses array");
    } else {
      console.log("Course already exists in user's purchasedCourses array");
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
  } catch (error: any) {
    console.error("Error simulating purchase:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
