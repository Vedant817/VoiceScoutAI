import { NextResponse } from "next/server";

const MAX_QUERY_LENGTH = 240;
const REQUEST_TIMEOUT_MS = 10_000;

type ResearchRequest = {
  query?: unknown;
};

type MarketReport = {
  query: string;
  generatedAt: string;
  summary: string;
  competitors: Array<{ name: string; rationale: string }>;
  marketRisks: string[];
  positioning: string[];
  nextSteps: string[];
  sources: Array<{ title: string; url: string }>;
  mode: "ai" | "demo";
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeQuery(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function withTimeout<T>(operation: Promise<T>, timeoutMs = REQUEST_TIMEOUT_MS) {
  return Promise.race([
    operation,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
    }),
  ]);
}

function getDemoReport(query: string, sources: MarketReport["sources"] = []): MarketReport {
  return {
    query,
    generatedAt: new Date().toISOString(),
    summary: `VoiceScout identified the likely market shape for "${query}" and prepared a demo-ready brief focused on competitors, risks, positioning, and immediate validation steps.`,
    competitors: [
      {
        name: "Established workflow platforms",
        rationale: "Large incumbents may already own the customer relationship and distribution channels.",
      },
      {
        name: "AI-native point solutions",
        rationale: "Specialized startups can move quickly with narrow, polished user experiences.",
      },
      {
        name: "Internal spreadsheets and manual research",
        rationale: "The cheapest competitor is often the current workaround customers already trust.",
      },
    ],
    marketRisks: [
      "Customers may not have frequent enough pain to justify a paid workflow.",
      "External data access, scraping terms, or API costs can limit margins.",
      "Generic AI tools may satisfy casual users unless the product owns a clear workflow niche.",
    ],
    positioning: [
      "Lead with a one-minute research-to-report promise for startup teams.",
      "Differentiate on structured outputs rather than open-ended chat.",
      "Use voice as the fastest capture layer, then let users refine reports in a dashboard.",
    ],
    nextSteps: [
      "Interview five target users about their last competitor-research task.",
      "Validate willingness to pay with a concierge report before building deeper automation.",
      "Track the top three repeated report sections and productize those first.",
    ],
    sources,
    mode: "demo",
  };
}

async function fetchFirecrawlContext(query: string) {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    return [];
  }

  const response = await withTimeout(
    fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, limit: 3 }),
    }),
  );

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  const results = Array.isArray(payload?.data) ? payload.data : [];

  return results.slice(0, 3).map((result: { title?: string; url?: string }) => ({
    title: result.title || "Untitled source",
    url: result.url || "https://example.com/source-unavailable",
  }));
}

async function fetchOpenRouterReport(query: string, sources: MarketReport["sources"]) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await withTimeout(
    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://voicescout.ai",
        "X-Title": "VoiceScout AI",
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return concise JSON with summary, competitors, marketRisks, positioning, and nextSteps for a startup market intelligence report.",
          },
          {
            role: "user",
            content: JSON.stringify({ query, sources }),
          },
        ],
      }),
    }),
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(content);

    return {
      ...getDemoReport(query, sources),
      ...parsed,
      query,
      generatedAt: new Date().toISOString(),
      sources,
      mode: "ai" as const,
    } satisfies MarketReport;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: ResearchRequest;

  try {
    body = await request.json();
  } catch {
    return jsonError("Send a JSON body with a query string.", 400);
  }

  const query = normalizeQuery(body.query);

  if (!query) {
    return jsonError("Query is required.", 400);
  }

  if (query.length < 8) {
    return jsonError("Query must be at least 8 characters long.", 400);
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return jsonError(`Query must be ${MAX_QUERY_LENGTH} characters or fewer.`, 400);
  }

  try {
    const sources = await fetchFirecrawlContext(query).catch((error) => {
      console.warn("Firecrawl context unavailable", error);
      return [];
    });
    const aiReport = await fetchOpenRouterReport(query, sources).catch((error) => {
      console.warn("OpenRouter report unavailable", error);
      return null;
    });

    return NextResponse.json({ report: aiReport ?? getDemoReport(query, sources) });
  } catch (error) {
    console.error("Research generation failed", error);

    return jsonError("Unable to generate a market report right now. Please try again later.", 502);
  }
}
