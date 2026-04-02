import { parentPort, workerData } from "node:worker_threads";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";

const stdout = [];
const stderr = [];
const decode = (chunk, encoding) => {
  if (typeof chunk === "string") return chunk;
  return Buffer.from(chunk).toString(typeof encoding === "string" ? encoding : "utf8");
};

const originalStdoutWrite = process.stdout.write.bind(process.stdout);
const originalStderrWrite = process.stderr.write.bind(process.stderr);
const originalExit = process.exit.bind(process);
const originalArgv = process.argv.slice();
const originalEnv = process.env.CLAUDE_PROJECT_DIR;

process.stdout.write = (chunk, encoding, callback) => {
  stdout.push(decode(chunk, encoding));
  if (typeof callback === "function") callback();
  return true;
};

process.stderr.write = (chunk, encoding, callback) => {
  stderr.push(decode(chunk, encoding));
  if (typeof callback === "function") callback();
  return true;
};

Object.defineProperty(process, "stdin", {
  value: Readable.from(workerData.stdin ? [Buffer.from(workerData.stdin, "utf8")] : []),
  configurable: true
});

process.env.CLAUDE_PROJECT_DIR = workerData.workspaceRoot;
process.argv = [process.execPath, workerData.scriptPath, ...workerData.args];
process.exit = (code = 0) => {
  throw new Error("__PROCESS_EXIT__" + code);
};

let status = 0;

try {
  await import(pathToFileURL(workerData.scriptPath).href + "?run=" + Date.now() + "-" + Math.random());
} catch (error) {
  if (typeof error?.message === "string" && error.message.startsWith("__PROCESS_EXIT__")) {
    status = Number(error.message.replace("__PROCESS_EXIT__", "")) || 0;
  } else {
    status = 1;
    stderr.push("\n" + (error?.stack || error?.message || String(error)) + "\n");
  }
} finally {
  process.stdout.write = originalStdoutWrite;
  process.stderr.write = originalStderrWrite;
  process.exit = originalExit;
  process.argv = originalArgv;
  if (originalEnv === undefined) {
    delete process.env.CLAUDE_PROJECT_DIR;
  } else {
    process.env.CLAUDE_PROJECT_DIR = originalEnv;
  }
}

parentPort.postMessage({ status, stdout: stdout.join(""), stderr: stderr.join("") });
