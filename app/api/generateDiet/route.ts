import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");
  const tubylytylkofigi = req.nextUrl.searchParams.get("tubylytylkofigi");

  // For development, allow requests without the secret key
  if (
    process.env.NODE_ENV === "production" &&
    (!tubylytylkofigi || tubylytylkofigi !== process.env.API_SECRET_KEY)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Create a Polish comprehensive diet plan for: ${topic}. Generate a complete, detailed diet with all the following information:

    {
      "title": "Creative and catchy diet title",
      "shortDescription": "Brief 2-3 sentence description of the diet",
      "description": "Detailed 4-5 paragraph explanation of the diet, its principles, and how it works",
      "category": "Choose from: Odchudzanie, Przybieranie na wadze, Mięśnie, Zdrowie, Wegetariańska, Wegańska, Bezglutenowa, Sportowa, Detoks, Energia, Sen, Koncentracja",
      "duration": "Realistic duration like '4 tygodnie', '8 tygodni', '12 tygodni'",
      "difficulty": "Łatwy, Średni, or Trudny",
      "meals": "Number between 3-6",
      "calories": "Number between 1200-2500",
      "price": "Price in PLN between 50-500",
      "originalPrice": "Higher price than current price",
      "tags": ["5-8 relevant tags"],
      "nutritionistName": "Realistic Polish name",
      "nutritionistCredentials": "Detailed qualifications and experience",
      "nutritionistBio": "2-3 paragraph professional background",
      "dietOverview": "Comprehensive overview of the diet plan and approach",
      "benefits": ["8-12 specific health benefits"],
      "contraindications": ["4-6 safety warnings and who should avoid"],
      "targetAudience": ["6-8 specific groups who would benefit"],
      "mealPlanStructure": "Detailed explanation of meal timing and structure",
      "shoppingList": ["15-20 specific food items to buy"],
      "preparationTips": ["8-10 practical preparation and cooking tips"],
      "progressTracking": "Detailed method for tracking progress and results",
      "maintenancePhase": "How to maintain results after the diet ends",
      "scientificReferences": ["3-5 scientific studies or research papers"],
      "clinicalStudies": ["2-3 specific clinical trial references"],
      "averageWeightLoss": "Realistic weight loss expectation",
      "averageTimeToResults": "When to expect first results",
      "successRate": "Percentage of people who achieve goals",
      "faq": [
        {
          "question": "Common question about the diet",
          "answer": "Detailed, helpful answer"
        }
      ],
      "testimonials": [
        {
          "name": "Realistic name",
          "age": "Age between 25-65",
          "weightLoss": "Specific result like '8 kg' or 'Poprawa energii'",
          "review": "Personal testimonial about their experience"
        }
      ],
      "beforeAfterStories": [
        {
          "name": "Realistic name",
          "age": "Age between 25-65",
          "beforeWeight": "Starting weight",
          "afterWeight": "Final weight",
          "story": "Detailed transformation story"
        }
      ],
      "questions": [
        {
          "question": "Assessment question for users",
          "answers": ["Multiple choice answers"]
        }
      ]
    }

    Make the content engaging, realistic, and varied. Include specific details, realistic expectations, and practical advice.`;

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 3000,
      n: 1,
      stop: null,
      temperature: 0.8,
    });

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
