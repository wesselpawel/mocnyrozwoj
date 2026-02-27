import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export async function POST(req: Request) {
  try {
    const {
      dietId,
      dietTitle,
      dietPrice,
      userEmail,
      userId,
      dietData,
      guestSessionId,
    } = await req.json();

    // Generate a unique order ID
    const orderId = `diet_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Prepare metadata with only essential order information (Stripe has 500 char limit)
    const metadata: Record<string, string> = {
      orderId,
      dietId,
      dietTitle,
      type: "diet_purchase",
      dietPrice: dietPrice.toString(),
      dietDuration: dietData.duration,
      dietDifficulty: dietData.difficulty,
      dietCategory: dietData.category,
    };

    // If user is logged in, add user information
    if (userId) {
      metadata.userId = userId;
      metadata.userEmail = userEmail;
      metadata.isGuestPurchase = "false";
    } else {
      // For guest users, use the guest session ID
      metadata.guestSessionId =
        guestSessionId ||
        `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      metadata.userEmail = userEmail || "guest@example.com";
      metadata.isGuestPurchase = "true";
    }

    // Create a Checkout Session for diet purchase
    const session = await stripe.checkout.sessions.create({
      mode: "payment", // One-time payment
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: dietTitle,
              description: `Plan dietetyczny: ${dietTitle}`,
              images: dietData.image ? [dietData.image] : [],
            },
            unit_amount: dietPrice * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}&type=diet`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      orderId,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
