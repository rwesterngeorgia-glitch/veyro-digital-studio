import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

// Only stop a process recorded as Veyro's own Vite server and validate its command line.
const pidFile = path.resolve(".preview-pid");
try {
  const pid = Number((await fs.readFile(pidFile, "utf8")).trim());
  if (!Number.isSafeInteger(pid) || pid <= 0)
    throw new Error("Invalid recorded PID.");
  if (process.platform !== "win32")
    throw new Error("Use Ctrl+C in the preview terminal on this platform.");
  const command = execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}").CommandLine`,
    ],
    { encoding: "utf8" },
  );
  if (
    !command
      .toLowerCase()
      .includes(path.resolve("node_modules/vite/bin/vite.js").toLowerCase())
  )
    throw new Error("Recorded process is no longer this Veyro server.");
  process.kill(pid);
  await fs.unlink(pidFile);
  console.log("Stopped the Veyro local preview.");
} catch (error) {
  if (error.code === "ENOENT")
    console.log(
      "No background preview PID recorded. Use Ctrl+C in the terminal running npm run dev.",
    );
  else {
    console.error(error.message);
    process.exitCode = 1;
  }
}
