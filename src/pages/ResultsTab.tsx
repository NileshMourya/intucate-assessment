import type { SQIResult } from "../types/index";
import { SQIBar } from "../components/SQIBar";
import { sqiColorClass, sqiLabel } from "../utils/helpers";

interface Props {
  results: SQIResult;
  onNext: () => void;
}

export function ResultsTab({ results, onNext }: Props) {
  const topicsSorted = [...results.topic_scores].sort((a, b) => a.sqi - b.sqi);
  const uniqueTopics = [...new Set(results.topic_scores.map((t) => t.topic))]
    .length;

  return (
    <div className="animate-fade-in space-y-8">
      {/* ===== METRICS ===== */}
      <div className="grid grid-cols-3 gap-5">
        <div className="rounded-xl border border-white/40 bg-gradient-to-br from-ember/10 to-orange-500/10 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-ink-100 uppercase tracking-wider mb-1">
            Overall SQI
          </p>
          <div className="text-3xl font-bold text-ink">
            {results.overall_sqi}
          </div>
          <div
            className={`text-xs font-semibold mt-1 ${sqiColorClass(results.overall_sqi)}`}
          >
            {sqiLabel(results.overall_sqi)}
          </div>
        </div>

        <div className="rounded-xl border border-white/40 bg-gradient-to-br from-cobalt/10 to-blue-500/10 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-ink-100 uppercase tracking-wider mb-1">
            Student
          </p>
          <div className="text-lg font-semibold text-ink">
            {results.student_id}
          </div>
          <div className="text-xs text-ink-100 mt-1">
            {results.metadata.total_attempts} attempts analysed
          </div>
        </div>

        <div className="rounded-xl border border-white/40 bg-gradient-to-br from-sage/10 to-green-500/10 p-5 shadow-sm backdrop-blur">
          <p className="text-xs text-ink-100 uppercase tracking-wider mb-1">
            Coverage
          </p>
          <div className="text-2xl font-semibold text-ink">
            {uniqueTopics} Topics
          </div>
          <div className="text-xs text-ink-100 mt-1">
            {results.concept_scores.length} concepts analysed
          </div>
        </div>
      </div>

      {/* ===== TOPIC SCORES ===== */}
      <div className="rounded-2xl border border-ink-100/20 bg-white shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-ink-100/20">
          <h3 className="font-semibold text-ink">Topic Performance</h3>
          <span className="text-xs text-ink-100">Lowest mastery first</span>
        </div>

        <div className="divide-y divide-ink-100/10">
          {topicsSorted.map((t) => (
            <div
              key={t.topic}
              className="flex items-center gap-6 px-6 py-4 hover:bg-paper/40 transition"
            >
              <div className="w-52 shrink-0">
                <p className="font-medium text-sm text-ink">{t.topic}</p>
              </div>

              <div className="flex-1">
                <SQIBar value={t.sqi} />
              </div>

              <div className="w-24 text-right">
                <span
                  className={`font-mono-dm font-bold ${sqiColorClass(t.sqi)}`}
                >
                  {t.sqi}
                </span>
                <span className="text-xs text-ink-100 ml-1">
                  {sqiLabel(t.sqi)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== RANKED CONCEPTS ===== */}
      <div className="rounded-2xl border border-ink-100/20 bg-white shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-ink-100/20">
          <h3 className="font-semibold text-ink">Concept Priority Ranking</h3>
          <span className="text-xs text-ink-100">
            Weight indicates teaching focus
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper/60 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] uppercase tracking-wider text-ink-100">
                  #
                </th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-ink-100">
                  Concept
                </th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-ink-100">
                  SQI
                </th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-ink-100">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-ink-100">
                  Reason
                </th>
              </tr>
            </thead>

            <tbody>
              {results.ranked_concepts_for_summary.map((c, i) => {
                const cs = results.concept_scores.find(
                  (x) => x.topic === c.topic && x.concept === c.concept,
                );

                return (
                  <tr
                    key={i}
                    className="border-t border-ink-100/10 hover:bg-paper/40 transition"
                  >
                    <td className="px-6 py-4 text-xs text-ink-100 font-mono-dm">
                      #{i + 1}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium text-ink">{c.concept}</div>
                      <div className="text-xs text-ink-100">{c.topic}</div>
                    </td>

                    <td className="px-4 py-4">
                      {cs && (
                        <div className="space-y-1">
                          <span
                            className={`font-bold ${sqiColorClass(cs.sqi)}`}
                          >
                            {cs.sqi}
                          </span>
                          <SQIBar value={cs.sqi} height="h-1" width="w-20" />
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">
                          {c.weight.toFixed(2)}
                        </div>
                        <div className="w-24 h-1.5 bg-ink-100/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-ember to-orange-500 rounded-full"
                            style={{ width: `${c.weight * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {c.reasons.map((r, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 text-[10px] rounded-md bg-paper border border-ink-100/20 text-ink-100"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="
            px-6 py-3 rounded-lg
           bg-indigo-600 font-medium hover:bg-indigo-700
            text-white text-sm 
            shadow-lg shadow-ember/30
            hover:scale-[1.02] hover:shadow-xl
            active:scale-[0.98]
            transition-all
          "
        >
          View JSON Output →
        </button>
      </div>
    </div>
  );
}
