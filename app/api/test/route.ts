import { NextResponse } from "next/server";
import OpenAI from "openai";

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
};

const DIET_PLAN_JSON_SCHEMA = {
  type: "object",
  properties: {
    plan_dnia: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nazwa_posilku: { type: "string" },
          godzina: { type: "string" },
          skladniki: {
            type: "array",
            items: {
              type: "object",
              properties: {
                produkt: { type: "string" },
                ilosc_g: { type: "number" },
              },
              required: ["produkt", "ilosc_g"],
              additionalProperties: false,
            },
          },
          kalorie_kcal: { type: "number" },
          bialko_g: { type: "number" },
          tluszcze_g: { type: "number" },
          weglowodany_g: { type: "number" },
        },
        required: [
          "nazwa_posilku",
          "godzina",
          "skladniki",
          "kalorie_kcal",
          "bialko_g",
          "tluszcze_g",
          "weglowodany_g",
        ],
        additionalProperties: false,
      },
    },
    lista_zakupow: {
      type: "array",
      items: {
        type: "object",
        properties: {
          produkt: { type: "string" },
          ilosc_calkowita_g: { type: "number" },
          kalorie_kcal: { type: "number" },
        },
        required: ["produkt", "ilosc_calkowita_g", "kalorie_kcal"],
        additionalProperties: false,
      },
    },
    przepisy: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nazwa_posilku: { type: "string" },
          skladniki: {
            type: "array",
            items: {
              type: "object",
              properties: {
                produkt: { type: "string" },
                ilosc_g: { type: "number" },
              },
              required: ["produkt", "ilosc_g"],
              additionalProperties: false,
            },
          },
          kroki: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["nazwa_posilku", "skladniki", "kroki"],
        additionalProperties: false,
      },
    },
    analiza: {
      type: "object",
      properties: {
        porady_dla_ciebie: {
          type: "array",
          items: { type: "string" },
          minItems: 4,
          maxItems: 6,
        },
        czego_unikac: {
          type: "array",
          items: { type: "string" },
          minItems: 4,
          maxItems: 6,
        },
        najczestsze_bledy: {
          type: "array",
          items: { type: "string" },
          minItems: 4,
          maxItems: 6,
        },
      },
      required: ["porady_dla_ciebie", "czego_unikac", "najczestsze_bledy"],
      additionalProperties: false,
    },
  },
  required: ["plan_dnia", "lista_zakupow", "przepisy", "analiza"],
  additionalProperties: false,
} as const;

const buildDietRequest = ({
  testName,
  answersJson,
  previousDayMealNames,
}: {
  testName: string;
  answersJson: string;
  previousDayMealNames: string[];
}) => ({
  model: "gpt-5.4-2026-03-05",
  input: [
    {
      role: "system" as const,
      content:
        "Jesteś doświadczonym dietetykiem, ale znasz ludzi i ich preferencje i nawyki. Klienci chcą otrzymać dietę z produktów które znają, oraz, dania, które można łatwo przygotować i szybko zjeść. Potrawy mają mieć niskie postrzeganie trudności, tak samo lista zakupów. Tworzysz wyłącznie jednodniowy plan żywieniowy na podstawie odpowiedzi użytkownika. Odpowiadasz tylko w języku polskim i tylko zgodnie ze schematem JSON.",
    },
    {
      role: "user" as const,
      content: `Na podstawie testu o nazwie "${testName}" wygeneruj 1-dniowy plan diety.

Odpowiedzi użytkownika:
${answersJson}

Nazwy posiłków z poprzedniego dnia (nie powtarzaj tych samych nazw):
${JSON.stringify(previousDayMealNames)}

Wymagania:
- Uwzględnij wyłącznie jeden dzień żywienia.
- Każdy posiłek musi zawierać policzone wartości: kalorie, białko_g, tłuszcze_g, węglowodany_g.
- Gramatura musi być podana dla każdego składnika.
- "lista_zakupow" ma być spójna z "plan_dnia" oraz "przepisy" (te same produkty i gramatury sumaryczne).
- "przepisy" mają być dla wszystkich posiłków z planu dnia.
- Na bazie celu użytkownika dodaj sekcję "analiza" z 3 osobnymi listami:
  1) "porady_dla_ciebie"
  2) "czego_unikac"
  3) "najczestsze_bledy"
- Każda lista w sekcji "analiza" ma zawierać od 4 do 6 konkretnych punktów.
- Używaj praktycznych, realnych produktów dostępnych w Polsce.
- Jeśli podano "Nazwy posiłków z poprzedniego dnia", nie używaj tych samych nazw posiłków ponownie.
- Nie dodawaj żadnych pól spoza schematu.`,
    },
  ],
  text: {
    format: {
      type: "json_schema" as const,
      name: "diet_plan_report",
      schema: DIET_PLAN_JSON_SCHEMA,
    },
  },
});

export async function POST(req: Request) {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing" },
        { status: 500 }
      );
    }

    const { prompt, testName, previousDayMealNames, stream } = await req.json();
    if (!Array.isArray(prompt) || prompt.length === 0 || !testName) {
      return NextResponse.json(
        { error: "Prompt (answers array) and testName are required" },
        { status: 400 }
      );
    }

    const answersJson = JSON.stringify(prompt, null, 2);
    const requestPayload = buildDietRequest({
      testName,
      answersJson,
      previousDayMealNames: Array.isArray(previousDayMealNames)
        ? previousDayMealNames
        : [],
    });

    if (!stream) {
      const response = await openai.responses.create(requestPayload);
      const result = JSON.parse(response.output_text);
      return NextResponse.json(result);
    }

    const encoder = new TextEncoder();
    const streamResponse = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: Record<string, unknown>) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          sendEvent("progress", {
            progress: 5,
            status: "Rozpoczynamy generowanie planu...",
          });
          const responseStream = await openai.responses.stream(requestPayload);
          sendEvent("progress", {
            progress: 15,
            status: "Model analizuje odpowiedzi...",
          });

          let outputText = "";
          for await (const event of responseStream) {
            if (event.type === "response.output_text.delta") {
              outputText += event.delta;
              sendEvent("delta", { text: event.delta });
            } else if (event.type === "response.completed") {
              sendEvent("progress", {
                progress: 90,
                status: "Finalizuję dane i waliduję JSON...",
              });
            }
          }

          const finalResponse = await responseStream.finalResponse();
          const finalOutputText = finalResponse.output_text || outputText;
          const result = JSON.parse(finalOutputText);

          sendEvent("final", { result });
          sendEvent("progress", {
            progress: 100,
            status: "Plan gotowy.",
          });
          controller.close();
        } catch {
          sendEvent("error", {
            error: "Nie udało się wygenerować raportu",
          });
          controller.close();
        }
      },
    });

    return new Response(streamResponse, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się wygenerować raportu" },
      { status: 500 }
    );
  }
}
