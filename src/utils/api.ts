import type { SQIResult, StudentData } from "../types";

const BASE = "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  async getPrompt(): Promise<{ prompt: string; version: string }> {
    const res = await fetch(`${BASE}/prompt`);
    return handleResponse(res);
  },

  async savePrompt(
    prompt: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return handleResponse(res);
  },

  async computeSQI(data: StudentData): Promise<SQIResult> {
    const res = await fetch(`${BASE}/compute-sqi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async health(): Promise<{ status: string }> {
    const res = await fetch(`${BASE}/health`);
    return handleResponse(res);
  },
};
