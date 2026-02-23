import type { Attempt } from "../types";

const IMPORTANCE_WEIGHTS: Record<string, number> = { A: 1.0, B: 0.7, C: 0.5 };
const DIFFICULTY_WEIGHTS: Record<string, number> = { E: 0.6, M: 1.0, H: 1.4 };
const TYPE_WEIGHTS: Record<string, number> = { Practical: 1.1, Theory: 1.0 };

function scoreAttempt(a: Attempt): { weighted: number; maxBase: number } {
  const base = a.correct ? a.marks : -a.neg_marks;
  const iw = IMPORTANCE_WEIGHTS[a.importance] ?? 1.0;
  const dw = DIFFICULTY_WEIGHTS[a.difficulty] ?? 1.0;
  const tw = TYPE_WEIGHTS[a.type] ?? 1.0;

  let weighted = base * iw * dw * tw;
  const maxBase = a.marks * iw * dw * tw;

  const tr = a.time_spent_sec / a.expected_time_sec;
  if (tr > 2) weighted *= 0.8;
  else if (tr > 1.5) weighted *= 0.9;

  if (a.marked_review && !a.correct) weighted *= 0.9;
  if (a.revisits > 0 && a.correct) weighted += 0.2 * a.marks;

  return { weighted, maxBase };
}

function clamp(v: number, mn: number, mx: number) {
  return Math.min(Math.max(v, mn), mx);
}

export function computeSQILocal(attempts: Attempt[]) {
  let totalW = 0,
    totalM = 0;
  const topicMap: Record<string, { w: number; m: number }> = {};
  const conceptMap: Record<
    string,
    {
      topic: string;
      concept: string;
      w: number;
      m: number;
      attempts: Attempt[];
    }
  > = {};

  for (const a of attempts) {
    const { weighted, maxBase } = scoreAttempt(a);
    totalW += weighted;
    totalM += maxBase;

    const tk = a.topic;
    const ck = `${a.topic}||${a.concept}`;

    if (!topicMap[tk]) topicMap[tk] = { w: 0, m: 0 };
    topicMap[tk].w += weighted;
    topicMap[tk].m += maxBase;

    if (!conceptMap[ck])
      conceptMap[ck] = {
        topic: a.topic,
        concept: a.concept,
        w: 0,
        m: 0,
        attempts: [],
      };
    conceptMap[ck].w += weighted;
    conceptMap[ck].m += maxBase;
    conceptMap[ck].attempts.push(a);
  }

  const overallSQI = parseFloat(
    clamp(totalM > 0 ? (totalW / totalM) * 100 : 0, 0, 100).toFixed(2),
  );

  const topicScores = Object.entries(topicMap).map(([topic, v]) => ({
    topic,
    sqi: parseFloat(clamp(v.m > 0 ? (v.w / v.m) * 100 : 0, 0, 100).toFixed(2)),
  }));

  const conceptScores = Object.values(conceptMap).map((v) => ({
    topic: v.topic,
    concept: v.concept,
    sqi: parseFloat(clamp(v.m > 0 ? (v.w / v.m) * 100 : 0, 0, 100).toFixed(2)),
  }));

  const rankedRaw = conceptScores.map((cs) => {
    const ck = `${cs.topic}||${cs.concept}`;
    const ca = conceptMap[ck].attempts;
    const wrongOnce = ca.some((a) => !a.correct) ? 1 : 0;
    const impAvg =
      ca.reduce((s, a) => s + (IMPORTANCE_WEIGHTS[a.importance] ?? 1), 0) /
      ca.length;
    const avgTR =
      ca.reduce((s, a) => s + a.time_spent_sec / a.expected_time_sec, 0) /
      ca.length;
    const timeProxy = avgTR < 0.8 ? 1 : avgTR <= 1.5 ? 0.7 : 0.4;
    const diagQ = 1 - cs.sqi / 100;
    const raw =
      0.4 * wrongOnce + 0.25 * impAvg + 0.2 * timeProxy + 0.15 * diagQ;

    const reasons: string[] = [];
    if (wrongOnce) reasons.push("Wrong at least once");
    if (impAvg >= 1.0) reasons.push("High importance (A)");
    else if (impAvg >= 0.7) reasons.push("Medium importance (B)");
    if (cs.sqi < 50) reasons.push("Low diagnostic score");
    if (avgTR > 1.5) reasons.push("Slow solve time");
    if (cs.sqi < 40) reasons.push("Critical gap identified");
    else if (cs.sqi < 70) reasons.push("Needs reinforcement");

    return { topic: cs.topic, concept: cs.concept, raw, reasons };
  });

  const maxW = Math.max(...rankedRaw.map((r) => r.raw));
  const minW = Math.min(...rankedRaw.map((r) => r.raw));

  const rankedConcepts = rankedRaw
    .map((r) => ({
      topic: r.topic,
      concept: r.concept,
      weight: parseFloat(
        maxW !== minW ? ((r.raw - minW) / (maxW - minW)).toFixed(3) : "1.000",
      ),
      reasons: r.reasons,
    }))
    .sort((a, b) => b.weight - a.weight);

  return { overallSQI, topicScores, conceptScores, rankedConcepts };
}

export const SAMPLE_DATA = {
  student_id: "S001",
  attempts: [
    {
      topic: "Borrowing Costs",
      concept: "Definitions",
      importance: "A",
      difficulty: "M",
      type: "Theory",
      case_based: false,
      correct: false,
      marks: 2,
      neg_marks: 0.5,
      expected_time_sec: 90,
      time_spent_sec: 130,
      marked_review: true,
      revisits: 1,
    },
    {
      topic: "Borrowing Costs",
      concept: "Capitalisation",
      importance: "A",
      difficulty: "H",
      type: "Practical",
      case_based: true,
      correct: true,
      marks: 2,
      neg_marks: 0.5,
      expected_time_sec: 150,
      time_spent_sec: 140,
      marked_review: false,
      revisits: 1,
    },
    {
      topic: "Exchange Differences",
      concept: "Treatment",
      importance: "B",
      difficulty: "E",
      type: "Theory",
      case_based: false,
      correct: true,
      marks: 1,
      neg_marks: 0.25,
      expected_time_sec: 60,
      time_spent_sec: 50,
      marked_review: false,
      revisits: 0,
    },
    {
      topic: "Exchange Differences",
      concept: "Recognition",
      importance: "A",
      difficulty: "H",
      type: "Practical",
      case_based: false,
      correct: false,
      marks: 3,
      neg_marks: 1,
      expected_time_sec: 120,
      time_spent_sec: 260,
      marked_review: true,
      revisits: 2,
    },
    {
      topic: "Provisions",
      concept: "Contingent Liabilities",
      importance: "B",
      difficulty: "M",
      type: "Theory",
      case_based: false,
      correct: true,
      marks: 1,
      neg_marks: 0.25,
      expected_time_sec: 60,
      time_spent_sec: 55,
      marked_review: false,
      revisits: 0,
    },
    {
      topic: "Provisions",
      concept: "Measurement",
      importance: "A",
      difficulty: "H",
      type: "Practical",
      case_based: true,
      correct: false,
      marks: 3,
      neg_marks: 1,
      expected_time_sec: 180,
      time_spent_sec: 200,
      marked_review: true,
      revisits: 1,
    },
    {
      topic: "Intangible Assets",
      concept: "Initial Recognition",
      importance: "A",
      difficulty: "M",
      type: "Theory",
      case_based: false,
      correct: true,
      marks: 2,
      neg_marks: 0.5,
      expected_time_sec: 90,
      time_spent_sec: 80,
      marked_review: false,
      revisits: 0,
    },
    {
      topic: "Intangible Assets",
      concept: "Amortisation",
      importance: "B",
      difficulty: "E",
      type: "Theory",
      case_based: false,
      correct: true,
      marks: 1,
      neg_marks: 0.25,
      expected_time_sec: 45,
      time_spent_sec: 42,
      marked_review: false,
      revisits: 0,
    },
  ],
} as unknown as import("../types").StudentData;
