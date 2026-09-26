// PreToolUse hook: blocks reading/editing .env files and committing API keys.
// Exit code 2 blocks the tool call and shows stderr to Claude.
import { execSync } from "node:child_process";

const input = JSON.parse(
  await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data || "{}"));
  }),
);

const ENV_FILE = /(^|[\\/\s"'=])\.env(\.[\w.-]+)?(?=$|[\s"';|&)])/;
const isAllowedEnv = (s) => /\.env\.example\b/.test(s) && !ENV_FILE.test(s.replace(/\.env\.example\b/g, ""));
// Anthropic keys (sk-ant-...) and Google API keys (AIza...).
const KEY = /sk-ant-[A-Za-z0-9_-]{10,}|AIza[0-9A-Za-z_-]{30,}/;

function block(reason) {
  process.stderr.write(`Blocked by protect-secrets hook: ${reason}\n`);
  process.exit(2);
}

const { tool_name: tool, tool_input: args = {} } = input;

if (["Read", "Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
  const file = String(args.file_path ?? args.notebook_path ?? "");
  if (ENV_FILE.test(file) && !isAllowedEnv(file))
    block(`${file} may contain secrets; ask the user to edit it.`);
  const content = String(args.content ?? args.new_string ?? "");
  if (KEY.test(content)) block("the new content contains what looks like an API key (Anthropic or Google).");
}

if (tool === "Bash" || tool === "PowerShell") {
  const cmd = String(args.command ?? "");
  if (ENV_FILE.test(cmd) && !isAllowedEnv(cmd))
    block("commands may not touch .env files (they hold secrets).");
  if (KEY.test(cmd)) block("the command contains what looks like an API key (Anthropic or Google).");
  if (/\bgit\s+commit\b/.test(cmd)) {
    try {
      const staged = execSync("git diff --cached -U0", { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
      if (KEY.test(staged)) block("staged changes contain what looks like an API key (Anthropic or Google).");
      const files = execSync("git diff --cached --name-only", { encoding: "utf8" }).split(/\r?\n/);
      const envFiles = files.filter((f) => /(^|\/)\.env/.test(f) && !f.endsWith(".env.example"));
      if (envFiles.length) block(`staged .env files: ${envFiles.join(", ")}`);
    } catch {
      // Not a git repo or git unavailable: nothing staged to inspect.
    }
  }
}

process.exit(0);
