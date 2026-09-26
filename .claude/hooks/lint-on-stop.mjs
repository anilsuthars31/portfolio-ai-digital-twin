// Stop hook: runs `npm run lint` so a session doesn't end with lint errors.
// Exit code 2 sends the errors back to Claude once; stop_hook_active prevents loops.
import { spawnSync } from "node:child_process";

const input = JSON.parse(
  await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data || "{}"));
  }),
);

if (input.stop_hook_active) process.exit(0);

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const lint = spawnSync("npm", ["run", "lint", "--silent"], { cwd, shell: true, encoding: "utf8" });

if (lint.status) {
  process.stderr.write(`npm run lint failed — please fix before finishing:\n${lint.stdout}${lint.stderr}`);
  process.exit(2);
}
process.exit(0);
