import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, rename } from "fs/promises";
import { existsSync } from "fs";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  // Backup old dist so the site stays up if the build fails
  const hasDist = existsSync("dist");
  if (hasDist) {
    await rm("dist.bak", { recursive: true, force: true });
    await rename("dist", "dist.bak");
  }

  try {
    console.log("building client...");
    await viteBuild();

    console.log("building server...");
    const pkg = JSON.parse(await readFile("package.json", "utf-8"));
    const allDeps = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    const externals = allDeps.filter((dep) => !allowlist.includes(dep));

    await esbuild({
      entryPoints: ["server/index.ts"],
      platform: "node",
      bundle: true,
      format: "cjs",
      outfile: "dist/index.cjs",
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      minify: true,
      external: externals,
      logLevel: "info",
    });

    // Build succeeded — remove backup
    await rm("dist.bak", { recursive: true, force: true });
    console.log("Build complete.");
  } catch (err) {
    console.error("Build failed:", err);

    // Restore old dist so the running server stays functional
    if (hasDist) {
      await rm("dist", { recursive: true, force: true });
      await rename("dist.bak", "dist");
      console.error("Restored previous dist. Server remains on old version.");
    }

    process.exit(1);
  }
}

buildAll();
