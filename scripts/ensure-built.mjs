import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));

function run(command, cwd) {
  const env = { ...process.env };
  delete env.npm_config_force;
  execSync(command, { cwd, stdio: "inherit", env });
}

function copyPackage(src, dest) {
  rmSync(dest, { recursive: true, force: true });
  cpSync(realpathSync(src), dest, { recursive: true });
  rmSync(join(dest, "node_modules"), { recursive: true, force: true });
}

function componentNames(packageDir) {
  const source = join(packageDir, "src/components/ui");
  const root = existsSync(source) ? source : join(packageDir, "dist/components/ui");
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function portableDeclarations(distDir) {
  for (const entry of readdirSync(distDir, { recursive: true })) {
    if (!String(entry).endsWith(".d.ts")) continue;
    const file = join(distDir, String(entry));
    const source = readFileSync(file, "utf8");
    const next = source.replaceAll(
      'import("class-variance-authority/types").ClassProp',
      "{ class?: string; className?: string }",
    );
    if (next !== source) writeFileSync(file, next);
  }
}

function writeSubpathExports(packageDir) {
  const pkgPath = join(packageDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  for (const name of componentNames(packageDir)) {
    pkg.exports[`./${name}`] = {
      types: `./dist/components/ui/${name}/index.d.ts`,
      import: `./dist/${name}.js`,
    };
  }
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

const link = join(rootDir, "node_modules/@isaac545454/nucleus");
if (!existsSync(link)) {
  console.log("skip @isaac545454/nucleus: ainda não está no node_modules da raiz");
  process.exit(0);
}

const installed = realpathSync(link);
const installedPkg = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"));
const ready =
  existsSync(join(installed, "dist/button.js")) &&
  existsSync(join(installed, "dist/card.js")) &&
  existsSync(join(installed, "dist/styles.css")) &&
  existsSync(join(installed, "dist/components/ui/button/button.d.ts")) &&
  installedPkg.exports?.["./button"]?.import === "./dist/button.js";

if (ready) process.exit(0);

const cache = join(rootDir, ".cache/ds-nucleo");
if (!existsSync(join(cache, "src/index.ts"))) {
  rmSync(cache, { recursive: true, force: true });
  mkdirSync(cache, { recursive: true });
  run(
    "curl -fsSL https://codeload.github.com/isaac545454/ds-nucleo/tar.gz/refs/heads/master | tar -xz --strip-components=1 -C .cache/ds-nucleo",
    rootDir,
  );
}

const depRoot = join(installed, "../..");
const cacheModules = join(cache, "node_modules");
rmSync(cacheModules, { recursive: true, force: true });
mkdirSync(join(cacheModules, "@types"), { recursive: true });

for (const name of [
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "lucide-react",
  "tailwindcss-animate",
]) {
  copyPackage(join(depRoot, name), join(cacheModules, name));
}

const radixDest = join(cacheModules, "@radix-ui");
mkdirSync(radixDest, { recursive: true });
for (const name of readdirSync(join(depRoot, "@radix-ui"))) {
  copyPackage(join(depRoot, "@radix-ui", name), join(radixDest, name));
}

for (const name of ["react", "react-dom"]) {
  copyPackage(join(rootDir, "node_modules", name), join(cacheModules, name));
}

for (const name of ["react", "react-dom"]) {
  copyPackage(join(rootDir, "node_modules/@types", name), join(cacheModules, "@types", name));
}

const entry = { index: "src/index.ts" };
for (const name of componentNames(cache)) {
  entry[name] = `src/components/ui/${name}/index.ts`;
}

writeFileSync(
  join(cache, "tsup.config.ts"),
  `import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ${JSON.stringify(entry, null, 2)},
  format: ["esm"],
  splitting: true,
  dts: false,
  sourcemap: true,
  clean: true,
  banner: { js: '"use client";' },
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      "@": path.join(process.cwd(), "src"),
    };
  },
});
`,
);

writeFileSync(
  join(cache, "tsconfig.build.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        declaration: true,
        emitDeclarationOnly: true,
        outDir: "dist",
        rootDir: "src",
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        baseUrl: ".",
        paths: { "@/*": ["./src/*"] },
      },
      include: ["src"],
      exclude: ["**/*.stories.tsx", "**/*.test.tsx", "**/*.test.ts"],
    },
    null,
    2,
  ),
);

console.log("build @isaac545454/nucleus");
run("pnpm exec tsup", cache);

try {
  run("pnpm exec tsc -p tsconfig.build.json --pretty false", cache);
} catch {
  if (!existsSync(join(cache, "dist/components/ui/label/label.d.ts"))) {
    throw new Error("nucleus: declaração do Label não foi gerada");
  }
}

run("pnpm exec tailwindcss -i src/styles.css -o dist/styles.css --minify", cache);
portableDeclarations(join(cache, "dist"));
cpSync(join(cache, "dist"), join(installed, "dist"), { recursive: true });
writeSubpathExports(installed);
writeFileSync(
  join(installed, "tailwind-preset.d.ts"),
  `declare const preset: {
  darkMode?: unknown;
  content?: unknown;
  theme?: unknown;
  plugins?: unknown;
};
export default preset;
`,
);
