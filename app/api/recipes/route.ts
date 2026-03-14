import { NextResponse } from "next/server";
import { getAllRecipes } from "@/lib/recipeService";

export async function GET() {
  try {
    const recipes = await getAllRecipes();
    return NextResponse.json({
      count: recipes.length,
      recipes: recipes.map((r) => ({
        slug: r.slug,
        name: r.name,
        goal: r.goal,
        mealType: r.mealType,
        calories: r.calories,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error), recipes: [] },
      { status: 500 }
    );
  }
}
