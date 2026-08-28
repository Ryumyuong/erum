// Dev-server launcher.
//
// Why this exists: a long-running `next dev` grows until its jest-worker child
// processes (used for things like generating static paths for dynamic routes)
// die on the default heap. Once they exceed the retry limit Next reports
// "Jest worker encountered 2 child process exceptions, exceeding retry limit"
// for EVERY route and never recovers — the server has to be restarted.
//
// Setting NODE_OPTIONS (rather than passing --max-old-space-size on the command
// line) is the point: workers are spawned with the parent's env, so the raised
// heap ceiling applies to them too. Override with NEXT_DEV_HEAP_MB if needed.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const heapMb = process.env.NEXT_DEV_HEAP_MB ?? "6144";
const nodeOptions = [process.env.NODE_OPTIONS, `--max-old-space-size=${heapMb}`]
  .filter(Boolean)
  .join(" ");

const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const child = spawn(
  process.execPath,
  [nextBin, "dev", ...process.argv.slice(2)],
  { stdio: "inherit", env: { ...process.env, NODE_OPTIONS: nodeOptions } },
);

child.on("exit", (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});
