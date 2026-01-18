import fs from "fs";
import path from "path";

async function ensureOutputDir() {
  const outDir = path.resolve(process.cwd(), "output", "cupons");
  fs.mkdirSync(outDir, { recursive: true });
  return outDir;
}

export default ensureOutputDir;
