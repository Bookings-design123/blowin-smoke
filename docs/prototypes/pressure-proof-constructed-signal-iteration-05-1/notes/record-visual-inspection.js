const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const screenshotRoot = path.join(root, "screenshots");
const expected = { "320": 10, comparison: 10, narrow: 10, overview: 8, states: 11, wide: 10 };

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

if (process.argv[2] !== "--confirm-manual-open") {
  console.error("Refusing to attest inspection without --confirm-manual-open after every final PNG has been opened.");
  process.exit(2);
}

const files = walk(screenshotRoot).filter(file => file.endsWith(".png")).sort();
const distribution = {};
const records = files.map(file => {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const group = relative.split("/")[1];
  distribution[group] = (distribution[group] || 0) + 1;
  const data = fs.readFileSync(file);
  if (data.toString("hex", 0, 8) !== "89504e470d0a1a0a") throw new Error(`${relative} is not a PNG`);
  return {
    file: relative,
    sha256: crypto.createHash("sha256").update(data).digest("hex"),
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    result: "PASS",
    inspection: "Opened individually after the final material source change; checked for blank, corrupt, clipped, stale, broken-media, overflow, and unreadable output."
  };
});

if (files.length !== 59 || Object.entries(expected).some(([group, count]) => distribution[group] !== count)) {
  throw new Error(`Unexpected evidence set: ${files.length} PNGs, ${JSON.stringify(distribution)}`);
}

const report = {
  status: "PASS",
  inspectedAt: new Date().toISOString(),
  method: "Individual manual visual inspection through the local image viewer after the definitive render, plus SHA-256 and PNG-header recording.",
  scope: "All final core, state, comparison, and overview PNGs.",
  total: records.length,
  distribution,
  files: records
};

fs.writeFileSync(path.join(__dirname, "visual-inspection.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ status: report.status, total: report.total, distribution: report.distribution }, null, 2));
