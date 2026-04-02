import { Worker } from "node:worker_threads";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { PROJECT_ROOT } from "../scripts/lib/common.mjs";

const TOOLKIT_ENTRIES = ["CLAUDE.md", ".claude", ".claude-gamekit"];

export async function createIsolatedWorkspace() {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), "gamekit-smoke-"));

  for (const entry of TOOLKIT_ENTRIES) {
    await cp(path.join(PROJECT_ROOT, entry), path.join(workspaceRoot, entry), { recursive: true, force: true });
  }

  await mkdir(path.join(workspaceRoot, "Assets"), { recursive: true });
  await writeFile(path.join(workspaceRoot, "Assets", ".gitkeep"), "");

  await mkdir(path.join(workspaceRoot, "ProjectSettings"), { recursive: true });
  await writeFile(path.join(workspaceRoot, "ProjectSettings", "ProjectVersion.txt"), "m_EditorVersion: 2022.3.0f1\n");

  await mkdir(path.join(workspaceRoot, "src"), { recursive: true });
  await writeFile(path.join(workspaceRoot, "src", "index.ts"), "export {};\n");

  await mkdir(path.join(workspaceRoot, "assets"), { recursive: true });
  await writeFile(path.join(workspaceRoot, "assets", ".gitkeep"), "");
  await mkdir(path.join(workspaceRoot, "settings"), { recursive: true });
  await writeFile(path.join(workspaceRoot, "settings", "project.json"), "{}\n");

  await writeFile(path.join(workspaceRoot, "package.json"), "{}\n");
  await writeFile(path.join(workspaceRoot, "project.godot"), "[gd_project]\n");
  await writeFile(path.join(workspaceRoot, "game.json"), "{}\n");

  return workspaceRoot;
}

export async function destroyIsolatedWorkspace(workspaceRoot) {
  await rm(workspaceRoot, { recursive: true, force: true });
}

export async function runToolkitScript(scriptRelativePath, { workspaceRoot, args = [], stdin = "" } = {}) {
  const scriptPath = path.join(PROJECT_ROOT, ".claude-gamekit", "core", "scripts", scriptRelativePath);
  const workerPath = path.join(PROJECT_ROOT, ".claude-gamekit", "core", "tests", "script-runner-worker.mjs");

  return new Promise((resolve, reject) => {
    const worker = new Worker(pathToFileURL(workerPath), {
      type: "module",
      workerData: {
        scriptPath,
        workspaceRoot,
        args,
        stdin
      }
    });

    let settled = false;

    worker.once("message", (message) => {
      settled = true;
      resolve(message);
      worker.terminate().catch(() => {});
    });

    worker.once("error", (error) => {
      if (!settled) {
        settled = true;
        reject(error);
      }
    });

    worker.once("exit", (code) => {
      if (!settled && code !== 0) {
        settled = true;
        reject(new Error(`Worker exited with code ${code}`));
      }
    });
  });
}

export function parseJsonOutput(output, label) {
  const trimmed = output.trim();
  if (!trimmed) {
    throw new Error(`Expected JSON output from ${label}, but stdout was empty.`);
  }

  return JSON.parse(trimmed);
}
