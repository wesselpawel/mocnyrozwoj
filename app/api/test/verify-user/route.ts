import { NextResponse } from "next/server";
import { getDocument } from "@/firebase";
import { userPurchasesService } from "@/lib/userPurchasesService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "No userId provided",
      });
    }

    // Get user document
    const userDoc = await getDocument("users", userId);

    // Get user purchases
    const userPurchases = await userPurchasesService.getUserPurchases(userId);

    // Check ownership using both methods
    const purchasedCourses = userDoc?.purchasedCourses || [];
    const purchaseCourseIds = userPurchases.map((p) => p.courseId);

    return NextResponse.json({
      success: true,
      user: userDoc,
      purchasedCourses,
      purchaseCourseIds,
      userPurchases,
      ownershipMatch: purchasedCourses.length === purchaseCourseIds.length,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
