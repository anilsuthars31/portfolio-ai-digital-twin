// Sends each question in twin-questions.json to /api/chat and prints the streamed answers.
// Usage: node scripts/test-twin.mjs [baseUrl]   (default http://localhost:3000)
import { readFile } from "node:fs/promises";

const baseUrl = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const questions = JSON.parse(await readFile(new URL("./twin-questions.json", import.meta.url), "utf8"));

let failures = 0;
for (const { category, question } of questions) {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
  });
  const answer = await res.text();
  if (!res.ok) failures++;
  console.log(`\n### [${category}] ${question}\nHTTP ${res.status}\n${answer.trim()}`);
}

process.exitCode = failures ? 1 : 0;
