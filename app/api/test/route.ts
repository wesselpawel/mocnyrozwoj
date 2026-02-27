import { NextResponse } from "next/server";
import OpenAI from "openai";

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
};

export async function POST(req: Request) {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing" },
        { status: 500 }
      );
    }

    const { prompt, testName } = await req.json();
    if (!prompt || !testName) {
      return NextResponse.json(
        { error: "Prompt and testName are required" },
        { status: 400 }
      );
    }
    const response = await openai.responses.create({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content:
            "Jesteś asystentem analizującym testy psychologiczne. Odpowiadasz tylko w języku polskim",
        },
        {
          role: "user",
          content: `Na podstawie testu o nazwie "${testName}", wygeneruj raport na podstawie następujących wyników: "${prompt}". Wynik musi być w poprawnym formacie JSON i zgodny ze schematem`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "test_report",
          schema: {
            type: "object",
            properties: {
              summary: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "The title of the test report",
                  },
                  description: {
                    type: "string",
                    description: "Summary based on the user's responses",
                  },
                },
                required: ["title", "description"],
                additionalProperties: false,
              },
              strengths: {
                type: "object",
                properties: {
                  personality_traits: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        trait: {
                          type: "string",
                          description:
                            "The polish name of the personality trait",
                        },
                        description: {
                          type: "string",
                          description: "Description of the personality trait",
                        },
                      },
                      required: ["trait", "description"],
                      additionalProperties: false,
                    },
                  },
                  self_confidence: {
                    type: "string",
                    description: "Description of self-confidence quality",
                  },
                },
                required: ["personality_traits", "self_confidence"],
                additionalProperties: false,
              },
              weaknesses: {
                type: "object",
                properties: {
                  areas_for_improvement: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        trait: {
                          type: "string",
                          description: "The polish name of the weakness trait",
                        },
                        description: {
                          type: "string",
                          description: "Description of the weakness trait",
                        },
                      },
                      required: ["trait", "description"],
                      additionalProperties: false,
                    },
                  },
                  confidence_barriers: {
                    type: "string",
                    description: "Description of confidence barriers",
                  },
                },
                required: ["areas_for_improvement", "confidence_barriers"],
                additionalProperties: false,
              },
              dream_alignment: {
                type: "object",
                properties: {
                  compatibility: {
                    type: "string",
                    description: "Description of dream alignment compatibility",
                  },
                  potential_challenges: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        challenge: {
                          type: "string",
                          description:
                            "Description of the challenge (dont put a dot at the end)",
                        },
                        solution: {
                          type: "string",
                          description: "Description of the proposed solution",
                        },
                      },
                      required: ["challenge", "solution"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["compatibility", "potential_challenges"],
                additionalProperties: false,
              },
              personalized_advice: {
                type: "object",
                properties: {
                  "self-improvement_tips": {
                    type: "array",
                    items: {
                      type: "string",
                      description: "A tip for self-improvement",
                    },
                  },
                  mindset_shift: {
                    type: "string",
                    description: "Description of the desired mindset shift",
                  },
                },
                required: ["self-improvement_tips", "mindset_shift"],
                additionalProperties: false,
              },
              next_steps: {
                type: "object",
                properties: {
                  actionable_goals: {
                    type: "array",
                    items: {
                      type: "string",
                      description: "An actionable goal for the user",
                    },
                  },
                  recommended_resources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          description:
                            "The polish type of the resource (e.g. Książka, Artykuł)",
                        },
                        title: {
                          type: "string",
                          description: "The title of the resource",
                        },
                        author: {
                          type: "string",
                          description: "The author of the resource",
                        },
                      },
                      required: ["type", "title", "author"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["actionable_goals", "recommended_resources"],
                additionalProperties: false,
              },
            },
            required: [
              "summary",
              "strengths",
              "weaknesses",
              "dream_alignment",
              "personalized_advice",
              "next_steps",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response.output_text);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Nie udało się wygenerować raportu" },
      { status: 500 }
    );
  }
}
