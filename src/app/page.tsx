"use client";

import { FormEvent, useState } from "react";

type Report = {
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

const examplePrompts = [
  "Voice-first CRM for solo real estate agents",
  "AI market research for climate hardware startups",
  "Competitor analysis for a multilingual hiring assistant",
];

export default function Home() {
  const [query, setQuery] = useState(examplePrompts[0]);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate report.");
      }

      setReport(payload.report);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to generate report.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-10 lg:px-12">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-cyan-400 text-lg font-black text-slate-950">V</div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">VoiceScout AI</p>
              <p className="text-xs text-slate-400">Market intelligence MVP</p>
            </div>
          </div>
          <a className="hidden rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 sm:inline-flex" href="#research">
            Try the flow
          </a>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Type or speak a startup idea → get competitor risks, positioning, and next steps.
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Voice-first market research for demo-ready startup decisions.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                VoiceScout now focuses on one working MVP slice: capture a research prompt, generate a structured market report, and keep the integration surface guarded for external AI and scraping services.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Validate idea"],
                ["02", "Map competitors"],
                ["03", "Plan next moves"],
              ].map(([step, label]) => (
                <div key={step} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                  <p className="text-sm text-cyan-200">{step}</p>
                  <p className="mt-2 font-semibold text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <section id="research" className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="query" className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  Research prompt
                </label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  maxLength={240}
                  className="mt-3 min-h-32 w-full resize-none rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-base text-white outline-none transition focus:border-cyan-300"
                  placeholder="Describe the startup idea or market you want to investigate."
                />
                <p className="mt-2 text-xs text-slate-400">{query.length}/240 characters</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setQuery(prompt)}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-cyan-300 px-5 py-4 font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Generating report..." : "Generate market report"}
              </button>
              {error ? <p className="rounded-2xl bg-red-500/15 p-3 text-sm text-red-100">{error}</p> : null}
            </form>
          </section>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <ReportCard title="Competitors" items={report?.competitors.map((item) => `${item.name}: ${item.rationale}`)} fallback="Competitor hypotheses appear here after generation." />
          <ReportCard title="Market risks" items={report?.marketRisks} fallback="Risk signals and reliability concerns appear here." />
          <ReportCard title="Next steps" items={report?.nextSteps} fallback="Validation actions appear here." />
        </section>

        {report ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Structured report</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{report.query}</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{report.mode} mode</span>
            </div>
            <p className="leading-7 text-slate-300">{report.summary}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ReportCard title="Positioning" items={report.positioning} fallback="" />
              <ReportCard title="Sources" items={report.sources.map((source) => source.title)} fallback="Add FIRECRAWL_API_KEY to enrich reports with live sources." />
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function ReportCard({ title, items, fallback }: { title: string; items?: string[]; fallback: string }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {items?.length ? (
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          {items.map((item) => (
            <li key={item} className="rounded-2xl bg-slate-950/50 p-3">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-400">{fallback}</p>
      )}
    </article>
  );
}
