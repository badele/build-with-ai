#!/usr/bin/env node
"use strict";
const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");

const [, , svgPath, pngPath] = process.argv;
if (!svgPath || !pngPath) {
  console.error("Usage: make-png.cjs <input.svg> <output.png>");
  process.exit(1);
}

const svg = fs.readFileSync(svgPath, "utf8");
const png = new Resvg(svg, { fitTo: { mode: "original" } }).render().asPng();
fs.writeFileSync(pngPath, png);
console.log(`PNG written to ${pngPath} (${png.length} bytes)`);
