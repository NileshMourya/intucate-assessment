import { useState } from "react";

const PLACEHOLDER = `Generate a 20-question diagnostic covering most topics and concepts.
Difficulty split: 20% Easy, 30% Medium, 50% Hard.
Importance: 50% A, 30% B, 20% C.
50% Practical / 50% Theory. Case=5%.
Use per-question time from our sheet.
Return JSON with topic, concept, importance, difficulty, type, case flag, marks, neg marks, expected time.`;

interface Props {
  onNext: () => void;
}

export function PromptTab({ onNext }: Props) {
  const [prompt, setPrompt] = useState<string>(
    () => localStorage.getItem("intucate_prompt") || "",
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!prompt.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem("intucate_prompt", prompt);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero info banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-cobalt/10 to-ember/10 border border-white/40 backdrop-blur px-6 py-4 shadow-sm">
        <p className="text-sm text-ink leading-relaxed">
          <span className="font-semibold text-cobalt">Diagnostic Prompt</span> —
          Configure the system prompt used by the analysis agent. This version
          will be stored and attached to every SQI payload.
        </p>
      </div>

      {/* Card */}
      <div className="relative rounded-2xl border border-ink-100/20 bg-white shadow-xl shadow-ink-100/10 overflow-hidden">
        {/* subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-paper pointer-events-none" />

        <div className="relative p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display tracking-tight text-ink">
              Agent Prompt Configuration
            </h2>

            {saved && (
              <span className="flex items-center gap-2 text-sage text-xs font-semibold bg-sage/10 px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Saved
              </span>
            )}
          </div>

          {/* Textarea */}
          <div className="relative group">
            <textarea
              placeholder={PLACEHOLDER}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="
                w-full min-h-[240px]
                rounded-xl border border-ink-100/30
               px-5 py-4
                text-sm leading-relaxed text-ink
                font-mono-dm
                outline-none resize-y
                transition-all
                group-hover:border-cobalt/40
                focus:border-cobalt
                focus:ring-1 focus:ring-cobalt/10
              "
            />

            {/* char badge */}
            <div className="absolute bottom-3 right-3 text-[11px] px-2 py-1 rounded-md bg-white border border-ink-100/20 text-ink-100 font-mono-dm">
              {prompt.length} chars
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between mt-7">
            <button
              onClick={() => setPrompt("")}
              className="px-4 py-2 text-sm rounded-lg border border-ink-100/30 text-ink hover:bg-paper transition"
            >
              Clear
            </button>

            <div className="flex items-center gap-3">
              {/* Save */}
              <button
                onClick={handleSave}
                disabled={!prompt.trim() || saving}
                className="
                  flex items-center gap-2 px-5 py-2.5 rounded-lg
                   text-white text-sm font-medium cursor-pointer
                  hover:bg-black transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {saving ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Prompt"
                )}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                className="
                  flex items-center gap-2 px-5 py-2.5
                  shadow-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50
                  hover:scale-[1.02] hover:shadow-xl
                  active:scale-[0.98]
                  transition-all
                  border
                "
              >
                Next Step
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
