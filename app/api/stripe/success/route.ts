import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET);
import { userPurchasesService } from "@/lib/userPurchasesService";
import { updateDocument, getDocument } from "@/firebase";

type StripeSubscriptionSnapshot = {
  status?: string;
  current_period_end?: number;
};

async function updateUserSubscriptionData(
  userId: string,
  subscriptionId: string | null,
  customerId: string | null,
  paymentData: { amount: number | null; date: number; result: string | null },
  sessionId: string
) {
  const userDoc = await getDocument("users", userId);

  if (!userDoc) {
    throw new Error(`User ${userId} not found`);
  }

  let subscriptionData: StripeSubscriptionSnapshot | null = null;

  if (subscriptionId) {
    try {
      subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
    } catch {}
  }

  const subscriptionStatus =
    subscriptionData?.status === "active" ||
    subscriptionData?.status === "trialing"
      ? "premium"
      : "free";

  const subscriptionEndDate = subscriptionData?.current_period_end
    ? new Date(subscriptionData.current_period_end * 1000).toISOString()
    : null;

  await updateDocument(
    [
      "subscriptionStatus",
      "subscriptionEndDate",
      "stripeSubscriptionId",
      "stripeCustomerId",
      "lastSubscriptionPayment",
      "updatedAt",
    ],
    [
      subscriptionStatus,
      subscriptionEndDate,
      subscriptionId,
      customerId,
      paymentData,
      new Date().toISOString(),
    ],
    "users",
    userId
  );

  // Prevent duplicate purchase writes for the same Stripe checkout session.
  const existingPurchases = await userPurchasesService.getUserPurchases(userId);
  const alreadySaved = existingPurchases.some(
    (purchase) => purchase.transactionId === sessionId
  );

  if (!alreadySaved) {
    await userPurchasesService.addPurchase({
      userId,
      courseId: subscriptionId || "subscription",
      courseTitle: "Subskrypcja premium",
      purchaseDate: new Date().toISOString(),
      amount: (paymentData.amount ?? 0) / 100,
      currency: "PLN",
      transactionId: sessionId,
      status: paymentData.result === "paid" ? "completed" : "pending",
      type: "subscription",
      expiresAt: subscriptionEndDate || undefined,
    });
    await userPurchasesService.updateUserPurchaseStats(userId);
  }
}

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

    if (isCoursePurchase || isDietPurchase) {
      const purchaseType = isDietPurchase ? "diet" : "course";
      const itemId = isDietPurchase
        ? session.metadata?.dietId
        : session.metadata?.courseId;
      const itemTitle = isDietPurchase
        ? session.metadata?.dietTitle
        : session.metadata?.courseTitle;
      const userId = session.metadata?.userId;
      const isGuestPurchase = session.metadata?.isGuestPurchase === "true";

      if (!itemId || !itemTitle) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing ${purchaseType} metadata`,
          },
          { status: 400 }
        );
      }

      // Guest purchases are intentionally not persisted as user purchases.
      if (isGuestPurchase) {
        return NextResponse.json({
          success: true,
          purchaseType,
          ...(isDietPurchase ? { dietId: itemId } : { courseId: itemId }),
          userId: null,
          session,
        });
      }

      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 400 }
        );
      }

      try {
        const userDoc = await getDocument("users", userId);
        const currentPurchasedCourses: string[] = userDoc?.purchasedCourses || [];

        if (currentPurchasedCourses.includes(itemId)) {
          return NextResponse.json(
            {
              success: false,
              error: `${
                isDietPurchase ? "Diet" : "Course"
              } already purchased`,
            },
            { status: 409 }
          );
        }

        await userPurchasesService.addPurchase({
          userId,
          courseId: itemId, // Reused field for both course and diet purchases
          courseTitle: itemTitle,
          purchaseDate: new Date().toISOString(),
          amount: (session.amount_total ?? 0) / 100, // Convert cents to currency units
          currency: (session.currency || "pln").toUpperCase(),
          transactionId: session.id,
          status: "completed",
          ...(isDietPurchase ? { type: "diet" as const } : {}),
        });

        await userPurchasesService.updateUserPurchaseStats(userId);
        await updateDocument(
          ["purchasedCourses", "updatedAt"],
          [[...currentPurchasedCourses, itemId], new Date().toISOString()],
          "users",
          userId
        );

        return NextResponse.json({
          success: true,
          purchaseType,
          ...(isDietPurchase ? { dietId: itemId } : { courseId: itemId }),
          userId,
          session,
        });
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: `Error saving ${purchaseType} purchase`,
          },
          { status: 500 }
        );
      }
    } else {
      // Handle subscription (existing logic)
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      const userId = session.metadata?.userId || session.metadata?.uid || null;

      const paymentData = {
        amount: session.amount_total ?? null,
        date: Date.now(),
        result: session.payment_status ?? null,
      };

      if (userId) {
        try {
          await updateUserSubscriptionData(
            userId,
            subscriptionId,
            customerId,
            paymentData,
            session.id
          );
        } catch {}
      }

      return NextResponse.json({
        success: true,
        purchaseType: "subscription",
        userId,
        subscriptionId,
        customerId,
        session,
      });
    }
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
