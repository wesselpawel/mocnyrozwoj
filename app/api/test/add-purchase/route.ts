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

    // Verify the purchase was added
    const userPurchases = await userPurchasesService.getUserPurchases(userId);

    return NextResponse.json({
      success: true,
      purchaseId,
      userPurchases,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
