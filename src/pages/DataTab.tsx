import { useState, useRef } from "react";
import type { SQIResult, StudentData } from "../types/index";
import { parseStudentJSON } from "../utils/helpers";
import { computeSQILocal, SAMPLE_DATA } from "../utils/sqi";

interface Props {
  onResults: (results: SQIResult) => void;
  onNext: () => void;
}

type InputMode = "json" | "upload";

export function DataTab({ onResults, onNext }: Props) {
  const [mode, setMode] = useState<InputMode>("json");
  const [rawJSON, setRawJSON] = useState("");
  const [parsedData, setParsedData] = useState<StudentData | null>(null);
  const [parseError, setParseError] = useState("");
  const [fileName, setFileName] = useState("");
  const [computing, setComputing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = () => {
    setParseError("");
    try {
      const data = parseStudentJSON(rawJSON);
      setParsedData(data);
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleFile = (file: File) => {
    setParseError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const data = parseStudentJSON(content);
        setParsedData(data);
        setRawJSON(JSON.stringify(data, null, 2));
      } catch (err: unknown) {
        setParseError(
          err instanceof Error ? err.message : "Could not parse file",
        );
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleLoadSample = () => {
    const json = JSON.stringify(SAMPLE_DATA, null, 2);
    setRawJSON(json);
    setParsedData(SAMPLE_DATA);
    setFileName("");
    setParseError("");
    setMode("json");
  };

  const handleCompute = async () => {
    if (!parsedData) return;
    setComputing(true);

    await new Promise((r) => setTimeout(r, 1000));

    try {
      const { overallSQI, topicScores, conceptScores, rankedConcepts } =
        computeSQILocal(parsedData.attempts);

      const result: SQIResult = {
        student_id: parsedData.student_id,
        overall_sqi: overallSQI,
        topic_scores: topicScores,
        concept_scores: conceptScores,
        ranked_concepts_for_summary: rankedConcepts,
        metadata: {
          diagnostic_prompt_version: "v1",
          computed_at: new Date().toISOString(),
          engine: "sqi-v0.1",
          total_attempts: parsedData.attempts.length,
        },
      };

      onResults(result);
      onNext();
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Computation failed");
    } finally {
      setComputing(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Student Attempt Data</h3>
          <button
            onClick={handleLoadSample}
            className="text-xs px-3 py-1.5 rounded-md border hover:bg-gray-50"
          >
            Load Sample
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            {(["upload", "json"] as InputMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 pb-3 text-xs font-semibold tracking-wide uppercase border-b-2 transition-all
                  ${
                    mode === m
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
              >
                {m === "upload" ? "Upload File" : "Paste JSON"}
              </button>
            ))}
          </div>

          {/* Upload */}
          {mode === "upload" && (
            <div
              className={`border-2 border-dashed rounded-xl py-12 text-center cursor-pointer transition-all
              ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400"}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <p className="font-semibold text-gray-700">
                Drag & drop JSON file
              </p>
              <p className="text-xs text-gray-500 mt-1">or click to browse</p>

              {fileName && (
                <div className="mt-4 inline-block text-xs px-3 py-1 border rounded bg-white">
                  {fileName}
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
            </div>
          )}

          {/* JSON */}
          {mode === "json" && (
            <>
              <textarea
                className="w-full min-h-[260px] p-4 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder='{ "student_id": "S001", "attempts": [] }'
                value={rawJSON}
                onChange={(e) => {
                  setRawJSON(e.target.value);
                  setParsedData(null);
                  setParseError("");
                }}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleParse}
                  disabled={!rawJSON.trim()}
                  className="text-xs px-4 py-2 rounded-md border hover:bg-gray-50"
                >
                  Validate JSON
                </button>
              </div>
            </>
          )}

          {/* Feedback */}
          {parseError && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              {parseError}
            </div>
          )}

          {parsedData && !parseError && (
            <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-3">
              Parsed student <strong>{parsedData.student_id}</strong> with{" "}
              <strong>{parsedData.attempts.length}</strong> attempts
            </div>
          )}
        </div>
      </div>

      {/* Compute button */}
      <div className="flex justify-end">
        <button
          onClick={handleCompute}
          disabled={!parsedData || computing}
          className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {computing ? "Computing SQI…" : "Compute SQI"}
        </button>
      </div>
    </div>
  );
}
