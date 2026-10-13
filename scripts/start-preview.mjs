import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const url = "http://127.0.0.1:5173/";
try {
  const existing = await fetch(url, { signal: AbortSignal.timeout(1500) });
  if (existing.ok && (await existing.text()).includes("Veyro")) {
    console.log(`Veyro is already running at ${url}`);
    process.exit(0);
  }
  throw new Error(
    "Port 5173 is occupied by another server. Keep it running and use npm run dev -- --port 5175 instead.",
  );
} catch (error) {
  if (error.message.includes("occupied")) throw error;
}
fs.mkdirSync("docs", { recursive: true });
const out = fs.openSync("docs/dev-server.log", "a");
const err = fs.openSync("docs/dev-server-error.log", "a");
const child = spawn(
  process.execPath,
  [
    path.resolve("node_modules/vite/bin/vite.js"),
    "--host",
    "127.0.0.1",
    "--port",
    "5173",
    "--strictPort",
  ],
  { detached: true, stdio: ["ignore", out, err], windowsHide: true },
);
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.unref();
fs.writeFileSync(".preview-pid", String(child.pid));
fs.closeSync(out);
fs.closeSync(err);
let ready = false;
for (let attempt = 0; attempt < 40; attempt++) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
    if (response.ok) {
      ready = true;
      break;
    }
  } catch {
    /* Wait for the owned server to become ready. */
  }
  await new Promise((resolve) => setTimeout(resolve, 250));
}
if (!ready) {
  try {
    process.kill(child.pid);
  } catch {
    /* Already exited. */
  }
  fs.unlinkSync(".preview-pid");
  throw new Error(
    "Local preview did not start. Read docs/dev-server-error.log.",
  );
}
console.log(
  `Veyro local preview: ${url}\nPID ${child.pid}. Stop with npm run stop.`,
);
