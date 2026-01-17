import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");
  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const chat = createChat({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
  });
  try {
    await chat.sendMessage("Ping");
    const response = await chat.sendMessage(
      `Pisz jak profesjonalista w dziedzinie rozwoju osobistego. Generujesz SEO dla posta na bloga na temat ${topic}. Generuj tylko tytuł, krótki opis, SEO dane, URL i tagi.`,
      {
        expect: {
          examples: [
            {
              title:
                "Poczucie własnej wartości – jak je zbudować, a nie tylko „mieć”?",
              shortDesc:
                "Nie rodzimy się z pewnością siebie – można ją wypracować. Zobacz jak.",
              googleTitle:
                "Jak budować poczucie własnej wartości – praktyczne wskazówki",
              googleDescription:
                "Dowiedz się, co naprawdę wpływa na poczucie własnej wartości i jak przestać się porównywać.",
              googleKeywords:
                "poczucie własnej wartości, pewność siebie, rozwój osobisty",
              url: "poczucie-wlasnej-wartosci-jak-budowac",
              urlLabel: "Przeczytaj, jak rozwijać własną wartość bez ściemy",
              category: "Psychologia",
              tags: "pewność siebie,wartość,rozwój,porównywanie,samoakceptacja",
            },
          ],
          properties: {
            title: "string",
            shortDesc: "string",
            googleTitle: "string",
            googleDescription: "string",
            googleKeywords: "string",
            url: "string",
            urlLabel: "string",
            category: "string",
            tags: "string",
          },
          schema: {
            additionalProperties: true,
            type: "object",
            required: [
              "title",
              "shortDesc",
              "googleTitle",
              "googleDescription",
              "googleKeywords",
              "url",
              "urlLabel",
              "category",
              "tags",
            ],
          },
        },
      }
    );
    return NextResponse.json(response.content);
  } catch (error) {
    console.error("Error generating blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to generate blog post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
