export function sqiColorClass(sqi: number): string {
  if (sqi >= 70) return "sqi-good";
  if (sqi >= 45) return "sqi-mid";
  return "sqi-bad";
}

export function sqiBarColor(sqi: number): string {
  if (sqi >= 70) return "#1a7a4a";
  if (sqi >= 45) return "#c9a227";
  return "#c5401e";
}

export function sqiLabel(sqi: number): string {
  if (sqi >= 80) return "Excellent";
  if (sqi >= 65) return "Good";
  if (sqi >= 50) return "Average";
  if (sqi >= 35) return "Weak";
  return "Critical";
}

export function parseStudentJSON(raw: string) {
  const data = JSON.parse(raw);
  if (!data.student_id || typeof data.student_id !== "string") {
    throw new Error("Missing or invalid student_id");
  }
  if (!Array.isArray(data.attempts) || data.attempts.length === 0) {
    throw new Error("attempts must be a non-empty array");
  }
  return data;
}

export function downloadJSON(obj: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-orange-300"; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-sky-300"; // key
          } else {
            cls = "text-emerald-300"; // string
          }
        } else if (/true|false/.test(match)) {
          cls = "text-violet-300"; // boolean
        } else if (/null/.test(match)) {
          cls = "text-rose-300";
        }
        return `<span class="${cls}">${match}</span>`;
      },
    );
}
