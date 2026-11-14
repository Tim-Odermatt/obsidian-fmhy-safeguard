import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "main.js",
  format: "cjs",
  platform: "browser",
  target: "es2020",

  // Import SVG files as text so they are embedded in main.js
  loader: {
    ".svg": "text"
  },

  external: [
    "obsidian",
    "electron",

    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",

    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr"
  ],

  sourcemap: watch ? "inline" : false,
  logLevel: "info"
});

if (watch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}