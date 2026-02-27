import { NextResponse } from "next/server";
import { coursesService } from "@/lib/coursesService";
import { userPurchasesService } from "@/lib/userPurchasesService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Get all courses
    const allCourses = await coursesService.getAllCourses();

    // Get user purchases if userId provided
    let userPurchases: Awaited<ReturnType<typeof userPurchasesService.getUserPurchases>> = [];
    if (userId) {
      userPurchases = await userPurchasesService.getUserPurchases(userId);
    }

    // Get all purchases
    const allPurchases = await userPurchasesService.getUserPurchases("all");

    return NextResponse.json({
      success: true,
      courses: allCourses,
      userPurchases,
      allPurchases,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
