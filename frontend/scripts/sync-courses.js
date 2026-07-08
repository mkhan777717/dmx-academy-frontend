import { coursesRegistry } from "../src/data/courses/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sync() {
  const targetDir = path.resolve(__dirname, "../../backend/src/data");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, "coursesRegistry.json");

  // Write courses registry as formatted JSON
  fs.writeFileSync(targetPath, JSON.stringify(coursesRegistry, null, 2), "utf-8");
  console.log(`[SYNC] Successfully serialized courses registry to ${targetPath}`);
}

sync().catch(console.error);
