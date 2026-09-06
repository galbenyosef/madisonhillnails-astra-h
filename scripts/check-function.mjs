import { build } from "esbuild";
await build({
  entryPoints: ["netlify/functions/appointment-emails.mts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outdir: ".cache/function-check",
  packages: "external",
});
console.log("Scheduled email function bundles successfully.");
