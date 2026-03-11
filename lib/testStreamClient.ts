type QaAnswer = { question: string; answer: string };

type StreamPayload = Record<string, unknown>;

export async function getDietPlanResultsStreamed({
  prompt,
  dietPlanName,
  onProgress,
  onDelta,
}: {
  prompt: QaAnswer[];
  dietPlanName?: string;
  onProgress?: (status: string, progress?: number) => void;
  onDelta?: (fullText: string, delta: string) => void;
}): Promise<Record<string, unknown>> {
  const response = await fetch("/api/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      prompt,
      testName: dietPlanName,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate diet");
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/event-stream")) {
    return (await response.json()) as Record<string, unknown>;
  }

  if (!response.body) {
    throw new Error("Empty streaming response");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: Record<string, unknown> | null = null;
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const lines = frame
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length === 0) continue;

      const eventLine = lines.find((line) => line.startsWith("event:"));
      const dataLines = lines
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());
      if (!eventLine || dataLines.length === 0) continue;

      const eventName = eventLine.slice(6).trim();
      let payload: StreamPayload | null = null;
      try {
        payload = JSON.parse(dataLines.join("\n")) as StreamPayload;
      } catch {
        payload = null;
      }
      if (!payload) continue;

      if (eventName === "progress") {
        const status = typeof payload.status === "string" ? payload.status : "";
        const progress =
          typeof payload.progress === "number" ? payload.progress : undefined;
        if (status) onProgress?.(status, progress);
      } else if (eventName === "delta") {
        const delta = typeof payload.text === "string" ? payload.text : "";
        if (!delta) continue;
        fullText += delta;
        onDelta?.(fullText, delta);
      } else if (eventName === "final") {
        if (payload.result && typeof payload.result === "object") {
          finalResult = payload.result as Record<string, unknown>;
        }
      } else if (eventName === "error") {
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Failed to generate diet",
        );
      }
    }
  }

  if (finalResult) return finalResult;

  if (fullText) {
    try {
      return JSON.parse(fullText) as Record<string, unknown>;
    } catch {
      // Ignore parse fallback and use generic error below.
    }
  }

  throw new Error("Streaming completed without final result");
}
