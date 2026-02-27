import { NextRequest, NextResponse } from "next/server";
import { createChat } from "completions";

export async function POST(req: NextRequest) {
  const { topic, section, currentDiet } = await req.json();

  if (!topic || !section) {
    return NextResponse.json(
      { error: "Topic and section are required" },
      { status: 400 }
    );
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

    let prompt = "";
    let expectedResponse = {};

    switch (section) {
      case "nutritionist":
        prompt = `Jesteś doświadczonym dietetykiem klinicznym. Dla diety "${topic}" wygeneruj profesjonalny profil dietetyka, który będzie wiarygodny i gotowy do komercjalizacji. Uwzględnij:
        - Imię i nazwisko dietetyka
        - Profesjonalne kwalifikacje i certyfikaty
        - Krótkie bio opisujące doświadczenie i specjalizację
        - Powiązanie z dietą ${topic}
        
        Odpowiedź w języku polskim.`;

        expectedResponse = {
          nutritionistName: "string",
          nutritionistCredentials: "string",
          nutritionistBio: "string",
        };
        break;

      case "benefits":
        prompt = `Dla diety "${topic}" wygeneruj szczegółowe korzyści zdrowotne, przeciwwskazania i grupę docelową. Uwzględnij:
        - 6-8 konkretnych korzyści zdrowotnych
        - 3-4 przeciwwskazania lub sytuacje wymagające konsultacji
        - 4-5 grup docelowych dla tej diety
        
        Odpowiedź w języku polskim.`;

        expectedResponse = {
          benefits: "string", // JSON array
          contraindications: "string", // JSON array
          targetAudience: "string", // JSON array
        };
        break;

      case "mealPlan":
        prompt = `Dla diety "${topic}" wygeneruj szczegółową strukturę planu posiłków, listę zakupów i wskazówki przygotowania. Uwzględnij:
        - Szczegółowy opis struktury planu posiłków
        - Listę 10-15 podstawowych produktów do zakupu
        - 4-5 praktycznych wskazówek przygotowania
        
        Odpowiedź w języku polskim.`;

        expectedResponse = {
          mealPlanStructure: "string",
          shoppingList: "string", // JSON array
          preparationTips: "string", // JSON array
        };
        break;

      case "scientific":
        prompt = `Dla diety "${topic}" wygeneruj podłoże naukowe z badaniami klinicznymi i odniesieniami naukowymi. Uwzględnij:
        - 3-4 konkretne badania naukowe z pełnymi cytatami
        - 2-3 badania kliniczne z liczbą uczestników
        - Metryki sukcesu (średnia utrata wagi, czas do efektów, wskaźnik sukcesu)
        
        Odpowiedź w języku polskim.`;

        expectedResponse = {
          scientificReferences: "string", // JSON array
          clinicalStudies: "string", // JSON array
          averageWeightLoss: "string",
          averageTimeToResults: "string",
          successRate: "string",
        };
        break;

      case "testimonials":
        prompt = `Dla diety "${topic}" wygeneruj wiarygodne świadectwa, historie sukcesu i FAQ. Uwzględnij:
        - 2-3 świadectwa z imionami, wynikami i komentarzami
        - 1-2 historie "przed i po" z konkretnymi wynikami
        - 3-4 często zadawane pytania z odpowiedziami
        
        Odpowiedź w języku polskim.`;

        expectedResponse = {
          testimonials: "string", // JSON array
          beforeAfterStories: "string", // JSON array
          faq: "string", // JSON array
        };
        break;

      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const response = await chat.sendMessage(prompt, {
      expect: {
        examples: [
          {
            ...Object.fromEntries(
              Object.keys(expectedResponse).map((key) => [key, "example value"])
            ),
          },
        ],
        properties: expectedResponse,
        schema: {
          additionalProperties: true,
          type: "object",
          required: Object.keys(expectedResponse),
        },
      },
    });

    // Extract JSON from the response content
    let jsonContent: string = String(response.content);

    // Ensure jsonContent is a string
    if (typeof response.content !== "string") {
      // If it's already an object, return it directly
      if (typeof response.content === "object" && response.content !== null) {
        return NextResponse.json(response.content);
      }
      return NextResponse.json(
        {
          error: "Invalid response format from AI",
          details: "Response content is not a string",
          rawContent: String(response.content).substring(0, 500) + "...",
        },
        { status: 500 }
      );
    }

    // If the response contains markdown code blocks, extract the JSON from them
    if (jsonContent.includes("```json")) {
      const jsonMatch = jsonContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }
    }

    // If the response contains just JSON without markdown, try to extract it
    if (jsonContent.includes("{") && jsonContent.includes("}")) {
      const jsonStart = jsonContent.indexOf("{");
      const jsonEnd = jsonContent.lastIndexOf("}") + 1;
      jsonContent = jsonContent.substring(jsonStart, jsonEnd);
    }

    // Parse the response content to ensure it's properly structured
    let responseData;
    try {
      responseData = JSON.parse(jsonContent);
    } catch {
      // If parsing fails, return a structured error response
      return NextResponse.json(
        {
          error: "Invalid response format from AI",
          details: "Failed to parse JSON response",
          rawContent: String(response.content).substring(0, 500) + "...",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(responseData);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Failed to generate detailed diet section",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
