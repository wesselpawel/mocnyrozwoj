import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  getAdminSessionCookieName,
  isValidAdminSessionToken,
} from "@/lib/adminAuth";

const ALLOWED_CATEGORIES = new Set([
  "Diety",
  "Przykładowe dni diety",
  "Konkretny cel dietetyczny",
]);

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    days: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          dayLabel: { type: "string" },
          mealsPerDay: { type: "number" },
          totalCalories: { type: "number" },
          meals: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                mealNumber: { type: "number" },
                mealName: { type: "string" },
                time: { type: "string" },
                calories: { type: "number" },
                proteinG: { type: "number" },
                fatG: { type: "number" },
                carbsG: { type: "number" },
                ingredients: {
                  type: "array",
                  items: { type: "string" },
                },
                preparationSteps: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: [
                "mealNumber",
                "mealName",
                "time",
                "calories",
                "proteinG",
                "fatG",
                "carbsG",
                "ingredients",
                "preparationSteps",
              ],
            },
          },
          notes: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["dayLabel", "mealsPerDay", "totalCalories", "meals", "notes"],
      },
    },
  },
  required: ["days"],
} as const;

const toSafeInt = (value: unknown, fallback: number) => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  return Math.round(num);
};

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(getAdminSessionCookieName())?.value;
  const isSessionValid = await isValidAdminSessionToken(cookie);
  if (!isSessionValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const category = typeof body?.category === "string" ? body.category : "";
    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json(
        { error: "Ta kategoria nie wspiera generowania dni diety." },
        { status: 400 },
      );
    }

    const calories = toSafeInt(body?.calories, 2000);
    const mealsPerDay = Math.min(8, Math.max(2, toSafeInt(body?.mealsPerDay, 4)));
    const mealVariantsRaw: unknown[] = Array.isArray(body?.mealVariants)
      ? (body.mealVariants as unknown[])
      : [];
    const normalizedMealVariants = mealVariantsRaw
      .map((variant: unknown) => toSafeInt(variant, mealsPerDay))
      .filter((variant: number) => variant >= 2 && variant <= 8);
    const mealVariants = Array.from(new Set<number>(normalizedMealVariants)).sort(
      (a: number, b: number) => a - b,
    );
    const targetMealVariants =
      mealVariants.length > 0 ? mealVariants : [mealsPerDay];
    const dietName =
      typeof body?.dietName === "string" ? body.dietName.trim() : "";
    const dietGoal =
      typeof body?.dietGoal === "string" ? body.dietGoal.trim() : "";
    const unwantedProducts =
      typeof body?.unwantedProducts === "string" ? body.unwantedProducts.trim() : "";
    const gender =
      typeof body?.gender === "string" && body.gender.trim()
        ? body.gender.trim()
        : "inna";

    if (!dietName || !dietGoal) {
      return NextResponse.json(
        { error: "Uzupełnij nazwę diety i cel diety." },
        { status: 400 },
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const allDays: unknown[] = [];

    for (const variantMealsPerDay of targetMealVariants) {
      const response = await openai.responses.create({
        model: "gpt-5.4-2026-03-05",
        input: [
          {
            role: "system",
            content:
              "Jesteś doświadczonym dietetykiem. Tworzysz praktyczny, realistyczny plan posiłków na 1 dzień dla polskiego odbiorcy. Odpowiadasz wyłącznie po polsku i wyłącznie JSON zgodny ze schematem.",
          },
          {
            role: "user",
            content: `Wygeneruj 1 dzień diety jako tablicę days z jednym elementem.

Kategoria bloga: ${category}
Kalorie dziennie: ${calories}
Liczba posiłków: ${variantMealsPerDay}
Nazwa diety: ${dietName}
Cel diety: ${dietGoal}
Niechciane produkty: ${unwantedProducts || "brak"}
Płeć: ${gender}

Wymagania:
- "days" ma być tablicą.
- Zwróć dokładnie jeden dzień.
- "dayLabel" powinien zawierać informację o ${variantMealsPerDay} posiłkach.
- "mealsPerDay" i liczba elementów w "meals" muszą się zgadzać.
- "totalCalories" ma być bliskie podanej wartości kalorii (maksymalnie +/- 120 kcal).
- Każdy posiłek musi zawierać makroskładniki i listę składników oraz kroki przygotowania.
- Używaj nazw i produktów codziennych, łatwo dostępnych w Polsce.`,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "diet_day_plan",
            schema: RESPONSE_SCHEMA,
          },
        },
      });

      const payload = JSON.parse(response.output_text) as { days: unknown[] };
      if (!Array.isArray(payload?.days) || payload.days.length === 0) {
        return NextResponse.json(
          { error: "Model nie zwrócił poprawnych danych dni diety." },
          { status: 502 },
        );
      }

      allDays.push(payload.days[0]);
    }

    if (allDays.length === 0) {
      return NextResponse.json(
        { error: "Model nie zwrócił poprawnych danych dni diety." },
        { status: 502 },
      );
    }

    return NextResponse.json({ days: allDays });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się wygenerować dni diety." },
      { status: 500 },
    );
  }
}
