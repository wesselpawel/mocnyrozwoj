import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET);
import { userPurchasesService } from "@/lib/userPurchasesService";
import { updateDocument, getDocument } from "@/firebase";

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({
        success: false,
        error: "No session_id provided",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if this is a course purchase, diet purchase, or subscription
    const isCoursePurchase = session.metadata?.type === "course_purchase";
    const isDietPurchase = session.metadata?.type === "diet_purchase";

    if (isCoursePurchase) {
      // Handle course purchase
      const courseId = session.metadata.courseId;
      const userId = session.metadata.userId;
      const courseTitle = session.metadata.courseTitle;
      const isGuestPurchase = session.metadata.isGuestPurchase === "true";

      console.log("Processing course purchase:", {
        courseId,
        userId,
        courseTitle,
        sessionId: session.id,
        amount: session.amount_total / 100,
        currency: session.currency,
        isGuestPurchase,
      });

      // Only record the purchase in the database for authenticated users
      if (!isGuestPurchase && userId) {
        try {
          const purchaseId = await userPurchasesService.addPurchase({
            userId,
            courseId,
            courseTitle,
            purchaseDate: new Date().toISOString(),
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency.toUpperCase(),
            transactionId: session.id,
            status: "completed",
          });

          console.log(
            `Course purchase saved to database with ID: ${purchaseId}`
          );

          // Update user purchase statistics in users collection
          try {
            await userPurchasesService.updateUserPurchaseStats(userId);
            console.log(`User ${userId} purchase stats updated`);

            // Add the purchased course to user's purchasedCourses array
            const userDoc = await getDocument("users", userId);
            const currentPurchasedCourses = userDoc?.purchasedCourses || [];

            if (!currentPurchasedCourses.includes(courseId)) {
              await updateDocument(
                ["purchasedCourses", "updatedAt"],
                [
                  [...currentPurchasedCourses, courseId],
                  new Date().toISOString(),
                ],
                "users",
                userId
              );
              console.log(
                `Added course ${courseId} to user ${userId} purchasedCourses`
              );
            } else {
              console.log(
                `Course ${courseId} already exists in user ${userId} purchasedCourses`
              );
            }
          } catch (userUpdateError) {
            console.error(
              "Error updating user purchase stats:",
              userUpdateError
            );
            // Don't fail the entire process if user update fails
          }

          // Verify the purchase was saved
          const userPurchases = await userPurchasesService.getUserPurchases(
            userId
          );
          console.log(
            `User ${userId} now has ${userPurchases.length} purchases:`,
            userPurchases.map((p) => ({
              courseId: p.courseId,
              courseTitle: p.courseTitle,
            }))
          );
        } catch (error) {
          console.error("Error saving purchase to database:", error);
          throw error;
        }
      } else {
        console.log(
          `Guest course purchase successful: Course ${courseId}, session ${session.id}`
        );
      }

      console.log(
        `Course purchase processed: Course ${courseId} for ${
          isGuestPurchase ? "guest" : "user " + userId
        }`
      );

      return NextResponse.json({
        success: true,
        purchaseType: "course",
        courseId,
        userId,
        session,
      });
    } else if (isDietPurchase) {
      // Handle diet purchase
      const dietId = session.metadata.dietId;
      const userId = session.metadata.userId;
      const dietTitle = session.metadata.dietTitle;
      const isGuestPurchase = session.metadata.isGuestPurchase === "true";

      console.log("Processing diet purchase:", {
        dietId,
        userId,
        dietTitle,
        sessionId: session.id,
        amount: session.amount_total / 100,
        currency: session.currency,
        isGuestPurchase,
      });

      // Only record the diet purchase in the database for authenticated users
      if (!isGuestPurchase && userId) {
        try {
          const purchaseId = await userPurchasesService.addPurchase({
            userId,
            courseId: dietId, // Reuse courseId field for diet purchases
            courseTitle: dietTitle,
            purchaseDate: new Date().toISOString(),
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency.toUpperCase(),
            transactionId: session.id,
            status: "completed",
            type: "diet", // Add type to distinguish from courses
          });

          console.log(`Diet purchase saved to database with ID: ${purchaseId}`);

          // Update user purchase statistics in users collection
          try {
            await userPurchasesService.updateUserPurchaseStats(userId);
            console.log(`User ${userId} purchase stats updated`);

            // Add the purchased diet to user's purchasedCourses array
            const userDoc = await getDocument("users", userId);
            const currentPurchasedCourses = userDoc?.purchasedCourses || [];

            if (!currentPurchasedCourses.includes(dietId)) {
              await updateDocument(
                ["purchasedCourses", "updatedAt"],
                [
                  [...currentPurchasedCourses, dietId],
                  new Date().toISOString(),
                ],
                "users",
                userId
              );
              console.log(
                `Added diet ${dietId} to user ${userId} purchasedCourses`
              );
            } else {
              console.log(
                `Diet ${dietId} already exists in user ${userId} purchasedCourses`
              );
            }

            // Verify the purchase was saved
            const userPurchases = await userPurchasesService.getUserPurchases(
              userId
            );
            console.log(
              `User ${userId} now has ${userPurchases.length} purchases:`,
              userPurchases.map((p) => ({
                courseId: p.courseId,
                courseTitle: p.courseTitle,
              }))
            );
          } catch (userUpdateError) {
            console.error(
              "Error updating user purchase stats:",
              userUpdateError
            );
            // Don't fail the entire process if user update fails
          }
        } catch (error) {
          console.error("Error saving diet purchase to database:", error);
          throw error;
        }
      } else {
        console.log(
          `Guest diet purchase successful: Diet ${dietId}, session ${session.id}`
        );
      }

      console.log(
        `Diet purchase processed: Diet ${dietId} for ${
          isGuestPurchase ? "guest" : "user " + userId
        }`
      );

      return NextResponse.json({
        success: true,
        purchaseType: "diet",
        dietId,
        userId,
        session,
      });
    } else {
      // Handle subscription (existing logic)
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      const paymentData = {
        amount: session.amount_total,
        date: Date.now(),
        result: session.payment_status,
      };

      // Update user subscription data (you'll need to implement this)
      // await updateUserSubscriptionData(
      //   session.metadata.uid,
      //   subscriptionId,
      //   customerId,
      //   paymentData
      // );

      return NextResponse.json({
        success: true,
        purchaseType: "subscription",
        subscriptionId,
        customerId,
        session,
      });
    }
  } catch (error: any) {
    console.error("Error retrieving session:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
