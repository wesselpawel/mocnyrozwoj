import { NextResponse } from "next/server";
import { userPurchasesService } from "@/lib/userPurchasesService";

export async function POST(req: Request) {
  try {
    const { userId, courseId, courseTitle } = await req.json();

    if (!userId || !courseId || !courseTitle) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: userId, courseId, courseTitle",
      });
    }

    console.log("Test: Adding purchase manually:", {
      userId,
      courseId,
      courseTitle,
    });

    // Add the purchase
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

    console.log("Test: Purchase added with ID:", purchaseId);

    // Verify the purchase was added
    const userPurchases = await userPurchasesService.getUserPurchases(userId);
    console.log("Test: User purchases after adding:", userPurchases);

    return NextResponse.json({
      success: true,
      purchaseId,
      userPurchases,
    });
  } catch (error: any) {
    console.error("Test: Error adding purchase:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
