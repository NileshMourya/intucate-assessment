import { useState } from "react";
import type { SQIResult } from "../types/index";
import { downloadJSON, syntaxHighlight } from "../utils/helpers";

interface Props {
  results: SQIResult;
}

export function OutputTab({ results }: Props) {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(results, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadJSON(results, "summary_customizer_input.json");
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Success banner */}
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-3">
        <svg
          className="w-5 h-5 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p className="text-sm text-emerald-700">
          <span className="font-semibold">
            summary_customizer_input.json ready
          </span>{" "}
          — {results.ranked_concepts_for_summary.length} concepts ranked
        </p>
      </div>

      {/* JSON Viewer Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-xs font-mono text-gray-500">
            summary_customizer_input.json
          </span>

          <div className="flex gap-2">
            {/* Copy */}
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-md border hover:bg-gray-50 flex items-center gap-1.5"
            >
              {copied ? "Copied!" : "Copy JSON"}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Download
            </button>
          </div>
        </div>

        {/* JSON */}
        <div className="bg-gray-900 rounded-b-xl p-5 overflow-auto max-h-[520px]">
          <pre
            className="font-mono text-xs leading-relaxed text-gray-100"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonStr) }}
          />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Payload */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b font-semibold text-gray-700">
            Payload Fields
          </div>
          <div className="p-6">
            <ul className="space-y-2 text-sm">
              {[
                ["student_id", results.student_id],
                ["overall_sqi", String(results.overall_sqi)],
                ["topic_scores", `${results.topic_scores.length} topics`],
                ["concept_scores", `${results.concept_scores.length} concepts`],
                [
                  "ranked_concepts",
                  `${results.ranked_concepts_for_summary.length} ranked`,
                ],
                ["metadata", "engine, timestamp, version"],
              ].map(([field, val]) => (
                <li key={field} className="flex justify-between text-gray-600">
                  <span className="font-mono text-xs text-gray-500">
                    {field}
                  </span>
                  <span className="text-xs">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b font-semibold text-gray-700">
            Metadata
          </div>
          <div className="p-6 space-y-3 text-sm text-gray-600">
            <div>
              <p className="text-xs uppercase text-gray-400">Engine</p>
              <p className="font-mono">{results.metadata.engine}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Prompt Version</p>
              <p className="font-mono">
                {results.metadata.diagnostic_prompt_version}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Total Attempts</p>
              <p className="font-mono">{results.metadata.total_attempts}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-400">Computed At</p>
              <p className="font-mono">
                {new Date(results.metadata.computed_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
