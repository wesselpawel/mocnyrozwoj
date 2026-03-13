import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const SUBSCRIPTION_PLANS: Record<
  string,
  { name: string; amount: number; days: number; features: string[] }
> = {
  basic: {
    name: "Poziom 2",
    amount: 9,
    days: 7,
    features: ["7 dni diety", "Czego unikać", "Najczęstsze błędy"],
  },
  advanced: {
    name: "Poziom 3",
    amount: 19,
    days: 14,
    features: ["14 dni diety", "Resetowanie dni", "Wymiana dań"],
  },
  pro: {
    name: "Poziom 4",
    amount: 29,
    days: 30,
    features: ["30 dni diety", "Najnowszy algorytm", "Pełen dostęp"],
  },
};

export async function POST(req: Request) {
  try {
    const { planId, userEmail, userId } = await req.json();
    const plan = SUBSCRIPTION_PLANS[String(planId || "").toLowerCase()];

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription plan" },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      ...(userEmail ? { customer_email: userEmail } : {}),
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: `${plan.name} - Subskrypcja DzienDiety`,
              description: `Plan miesięczny (${plan.days} dni): ${plan.features.join(", ")}`,
            },
            recurring: {
              interval: "month",
            },
            unit_amount: plan.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "subscription",
        subscriptionPlan: String(planId).toLowerCase(),
        userId: userId || "",
        userEmail: userEmail || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
