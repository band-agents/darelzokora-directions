/**
 * Build the site and publish it to GitHub Pages.
 *
 *   npm run deploy:pages
 *
 * Lands at https://band-agents.github.io/darelzokora-directions/: the overview
 * board at the root, the directions at #bubble, #split and #sticker.
 *
 * Vite's base is "./" and routing is by hash, so the build works under any
 * sub-path as it is: no VITE_BASE, and no 404.html fallback.
 *
 * The publish is a throwaway git repo inside the staging directory, force
 * pushed to gh-pages, so that branch only ever holds build output. git runs
 * WITHOUT a shell: on Windows `shell: true` re-parses the arguments and splits
 * a commit message into pathspecs. npm needs the shell there (npm.cmd).
 */

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const REMOTE = "https://github.com/band-agents/darelzokora-directions.git";
const BRANCH = "gh-pages";

rmSync(DIST, { recursive: true, force: true });
execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" });

const stage = mkdtempSync(join(tmpdir(), "dz-pages-"));
cpSync(DIST, stage, { recursive: true });
/* Otherwise Pages runs Jekyll, which drops anything starting with "_". */
writeFileSync(join(stage, ".nojekyll"), "");

const git = (args) => execFileSync("git", args, { cwd: stage, stdio: "inherit", shell: false });
git(["init", "-q", "-b", BRANCH]);
git(["add", "-A"]);
git(["-c", "user.name=band-agents", "-c", "user.email=band.digi.tech@gmail.com", "commit", "-q", "-m", "Publish build"]);
git(["push", "-q", "-f", REMOTE, BRANCH]);
rmSync(stage, { recursive: true, force: true });

console.log("\n✓ https://band-agents.github.io/darelzokora-directions/");
console.log("If a change does not show, trigger a rebuild:");
console.log("  gh api -X POST repos/band-agents/darelzokora-directions/pages/builds\n");
