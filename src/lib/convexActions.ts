// Funzioni statiche per dati hardcoded - solo UI frontend
import { staticData } from "@/lib/dataClient";

export async function listTests() {
  return staticData.tests;
}

export async function listMacroareas() {
  return staticData.macroareas;
}

export async function createTest(input: { name: string; jiraLink?: string; macroareaIds: string[] }) {
  // Simulazione creazione - per UI purposes
  const id = `test-${Date.now()}`;
  console.log("Simulazione creazione test:", input);
  return { id };
}

export async function getTestDetail(id: string) {
  const test = staticData.tests.find((t) => t._id === id) ?? null;
  const tasks = staticData.testTasks[id as keyof typeof staticData.testTasks] ?? [];
  return { test, tasks };
}

export async function updateTask(input: { taskId: string; status?: string; notes?: string }) {
  console.log("Simulazione update task:", input);
  return { ok: true };
}


