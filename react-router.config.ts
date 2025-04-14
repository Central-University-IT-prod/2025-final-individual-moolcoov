import type { Config } from "@react-router/dev/config";
import path from "path";
import fs from "fs-extra";

const sourceDir = path.join(__dirname, "public", "client");
const targetDir = path.join(__dirname, "public");

async function copyFiles() {
  // вот это так вот потому что react-router не хочет ложить
  // клиентские файлы куда либо еще кроме /client

  try {
    if (await fs.pathExists(sourceDir)) {
      await fs.copy(sourceDir, targetDir, { overwrite: true });
      await fs.remove(sourceDir);
      console.log("Files copied successfully!");
    } else {
      console.log("Source directory does not exist.");
    }
  } catch (err) {
    console.error("Error copying files:", err);
  }
}

export default {
  ssr: false,
  buildDirectory: "public",
  buildEnd: async () => {
    await copyFiles();
  },
} satisfies Config;
