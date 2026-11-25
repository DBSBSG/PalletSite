import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = new URL("../src/", import.meta.url);
const output = new URL("../dist/", import.meta.url);

await rm(fileURLToPath(output), { recursive: true, force: true });
await mkdir(output);

for (const path of ["index.html", "assets", "css", "js"]) {
  const sourcePath = new URL(path, source);
  const outputPath = new URL(path, output);
  try {
    await cp(sourcePath, outputPath, {
      recursive: true,
      filter: (file) => !file.endsWith(".gitkeep"),
    });
  } catch (error) {
    // TypeScript emits no JavaScript while the scaffold has only declarations.
    if (path !== "js" || error.code !== "ENOENT") throw error;
  }
}
