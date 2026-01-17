import { NextResponse } from "next/server";
import { coursesService } from "@/lib/coursesService";
import { userPurchasesService } from "@/lib/userPurchasesService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("Debug: Checking current state for user:", userId);

    // Get all courses
    const allCourses = await coursesService.getAllCourses();
    console.log("Debug: All courses:", allCourses);

    // Get user purchases if userId provided
    let userPurchases: any = [];
    if (userId) {
      userPurchases = await userPurchasesService.getUserPurchases(userId);
      console.log("Debug: User purchases:", userPurchases);
    }

    // Get all purchases
    const allPurchases = await userPurchasesService.getUserPurchases("all");
    console.log("Debug: All purchases:", allPurchases);

    return NextResponse.json({
      success: true,
      courses: allCourses,
      userPurchases,
      allPurchases,
    });
  } catch (error: any) {
    console.error("Debug: Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
