import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { PromptTab } from "./pages/PromptTab";
import { DataTab } from "./pages/DataTab";
import { ResultsTab } from "./pages/ResultsTab";
import { OutputTab } from "./pages/OutputTab";
import { getSession, clearSession } from "./utils/auth";
import type { Session, SQIResult, TabId } from "./types";

const PAGE_META: Record<TabId, { title: string; subtitle: string }> = {
  prompt: {
    title: "Diagnostic Prompt",
    subtitle: "Configure the agent system prompt",
  },
  data: {
    title: "Student Data Upload",
    subtitle: "Upload or paste student attempt data",
  },
  results: {
    title: "SQI Analysis",
    subtitle: "Student Quality Index breakdown",
  },
  output: {
    title: "JSON Output",
    subtitle: "summary_customizer_input.json for next agent",
  },
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("prompt");
  const [results, setResults] = useState<SQIResult | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const s = await getSession();
      if (mounted) setSession(s);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setActiveTab("prompt");
    setResults(null);
  };

  if (!session) return <LoginPage onLogin={setSession} />;

  const meta = PAGE_META[activeTab];
  const tabs: TabId[] = ["prompt", "data", "results", "output"];
  const current = tabs.indexOf(activeTab);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        onLogout={handleLogout}
        hasResults={!!results}
      />

      {/* Main */}
      <main className="ml-64 flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b px-10 py-6 flex items-start justify-between shadow-sm">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {meta.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{meta.subtitle}</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-1">
            {tabs.map((tab, i) => {
              const isDone = i < current;
              const isActive = tab === activeTab;

              return (
                <div key={tab} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition
                      ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : isDone
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {isDone ? "✓" : i + 1}
                    <span className="capitalize">{tab}</span>
                  </div>

                  {i < tabs.length - 1 && (
                    <div
                      className={`w-5 h-px ${isDone ? "bg-emerald-300" : "bg-gray-300"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </header>

        {/* Body */}
        <div className="px-10 py-8 max-w-7xl">
          {activeTab === "prompt" && (
            <PromptTab onNext={() => setActiveTab("data")} />
          )}

          {activeTab === "data" && (
            <DataTab
              onResults={setResults}
              onNext={() => setActiveTab("results")}
            />
          )}

          {activeTab === "results" && results && (
            <ResultsTab
              results={results}
              onNext={() => setActiveTab("output")}
            />
          )}

          {activeTab === "output" && results && <OutputTab results={results} />}

          {/* Empty state */}
          {(activeTab === "results" || activeTab === "output") && !results && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-5">
                {activeTab === "results" ? "📊" : "📦"}
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No data yet
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Upload student attempt data and compute SQI first.
              </p>
              <button
                onClick={() => setActiveTab("data")}
                className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Go to Data Upload
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
