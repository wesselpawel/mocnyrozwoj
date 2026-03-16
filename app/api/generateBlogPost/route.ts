import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

type GenerateInput = {
  topic: string;
  title?: string;
  category?: string;
  shortDesc?: string;
};

const getPrompt = ({ topic, title, category, shortDesc }: GenerateInput) => {
  const optionalContext = [
    title?.trim() ? `- Preferowany tytuł: ${title.trim()}` : "",
    category?.trim() ? `- Preferowana kategoria: ${category.trim()}` : "",
    shortDesc?.trim() ? `- Wstępny krótki opis: ${shortDesc.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `Pisz jak profesjonalista w dziedzinie rozwoju osobistego i dietetyki.
Generujesz SEO i treść dla posta na bloga na temat: ${topic}.
Jeśli podano dodatkowy kontekst, uwzględnij go:
${optionalContext || "- Brak dodatkowego kontekstu."}
Odpowiedz wyłącznie poprawnym JSON-em (bez markdown, bez \`\`\`json), z polskimi wartościami.`;
};

const BLOG_POST_KEYS = [
  "title", "shortDesc", "googleTitle", "googleDescription", "googleKeywords",
  "url", "urlLabel", "category", "tags",
  "text1Title", "text1Desc", "text2Title", "text2Desc", "text3Title", "text3Desc",
  "text4Title", "text4Desc", "text5Title", "text5Desc", "text6Title", "text6Desc",
  "text7Title", "text7Desc",
] as const;

const runGeneration = async ({ topic, title, category, shortDesc }: GenerateInput) => {
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
    const response = await chat.sendMessage(
      getPrompt({ topic, title, category, shortDesc }),
      {
        expect: {
          examples: [
            Object.fromEntries(BLOG_POST_KEYS.map((k) => [k, "przykładowa wartość"])),
          ],
          schema: {
            additionalProperties: true,
            type: "object",
            properties: Object.fromEntries(
              BLOG_POST_KEYS.map((k) => [k, { type: "string" as const }])
            ),
            required: [...BLOG_POST_KEYS],
          },
        },
      }
    );

    let jsonContent: string = String(response.content ?? "");

    // If the model already returned a structured object, just forward it
    if (typeof response.content === "object" && response.content !== null) {
      return NextResponse.json(response.content);
    }

    if (typeof response.content !== "string") {
      return NextResponse.json(
        {
          error: "Invalid response format from AI",
          details: "Response content is not a string",
          rawContent: jsonContent.substring(0, 500) + "...",
        },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    if (jsonContent.includes("```json")) {
      const jsonMatch = jsonContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }
    }

    // If the response contains JSON mixed with text, extract the JSON object
    if (jsonContent.includes("{") && jsonContent.includes("}")) {
      const jsonStart = jsonContent.indexOf("{");
      const jsonEnd = jsonContent.lastIndexOf("}") + 1;
      jsonContent = jsonContent.substring(jsonStart, jsonEnd);
    }

    try {
      const data = JSON.parse(jsonContent);
      return NextResponse.json(data);
    } catch (parseErr) {
      return NextResponse.json(
        {
          error: "Failed to generate blog post",
          details: "Failed to parse JSON response from AI",
          rawContent: jsonContent.substring(0, 500) + "...",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("[generateBlogPost]", message, stack);
    return NextResponse.json(
      {
        error: "Failed to generate blog post",
        details: message,
      },
      { status: 500 }
    );
  }
};

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic") || "";
  const title = req.nextUrl.searchParams.get("title") || "";
  const category = req.nextUrl.searchParams.get("category") || "";
  const shortDesc = req.nextUrl.searchParams.get("shortDesc") || "";

  return runGeneration({ topic, title, category, shortDesc });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = typeof body?.topic === "string" ? body.topic : "";
    const title = typeof body?.title === "string" ? body.title : "";
    const category = typeof body?.category === "string" ? body.category : "";
    const shortDesc = typeof body?.shortDesc === "string" ? body.shortDesc : "";

    return runGeneration({ topic, title, category, shortDesc });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
