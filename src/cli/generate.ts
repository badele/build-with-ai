import { writeFileSync } from "node:fs";
import { generateBadge } from "../badge/generate";
import { parseUrl } from "../url/parse";

// INPUT_STYLE_URL: query string copied from the badge generator web app.
// How to get it:
//   1. Open the badge generator app
//   2. Customize your badge (text, fields, colors, sizes…)
//   3. Click "Copy URL" — this copies the full URL to your clipboard
//   4. Paste only the query string part (starting with '?') as the value of style_url
//      Example: ?text=BUILT+WITH+AI&f=SPEC%3AHUMAN%2BAI&sz_rw=120&c_rgs=6d20ff
const styleUrl = process.env["INPUT_STYLE_URL"] ?? "";
const output   = process.env["INPUT_OUTPUT"]    ?? "build-with-ai.svg";

const config = parseUrl(styleUrl);
const svg = generateBadge(config);
writeFileSync(output, svg, "utf8");

console.log(`Badge written to ${output} (${svg.length} bytes)`);
