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
Generujesz SEO dla posta na bloga na temat: ${topic}.
Generuj tylko: tytuł, krótki opis, SEO dane, URL i tagi.
Jeśli podano dodatkowy kontekst, uwzględnij go:
${optionalContext || "- Brak dodatkowego kontekstu."}`;
};

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
    await chat.sendMessage("Ping");

    const response = await chat.sendMessage(
      getPrompt({ topic, title, category, shortDesc })
    );

    let jsonContent: string = String(response.content);

    // If the model already returned a structured object, just forward it
    if (typeof response.content === "object" && response.content !== null) {
      return NextResponse.json(response.content);
    }

    if (typeof response.content !== "string") {
      return NextResponse.json(
        {
          error: "Invalid response format from AI",
          details: "Response content is not a string",
          rawContent: String(response.content).substring(0, 500) + "...",
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
    } catch {
      return NextResponse.json(
        {
          error: "Failed to generate blog post",
          details: "Failed to parse JSON response from AI",
          rawContent: String(response.content).substring(0, 500) + "...",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Failed to generate blog post",
        details: error instanceof Error ? error.message : "Unknown error",
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
