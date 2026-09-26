// PostToolUse hook: formats the file Claude just edited with Prettier, then ESLint --fix for TS/JS.
// Never blocks: formatting problems are reported but the edit stands.
import { spawnSync } from "node:child_process";
import path from "node:path";

const input = JSON.parse(
  await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data || "{}"));
  }),
);

const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const ext = path.extname(file).toLowerCase();
const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const run = (args) =>
  spawnSync("npx", ["--no-install", ...args, file], { cwd, shell: true, encoding: "utf8" });

if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css", ".md"].includes(ext))
  run(["prettier", "--write"]);
if ([".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(ext)) {
  const lint = run(["eslint", "--fix"]);
  if (lint.status) process.stderr.write(lint.stdout + lint.stderr);
}

process.exit(0);
