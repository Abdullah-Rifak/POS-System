#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const args = process.argv.slice(2);
const getArgValue = (name, fallback = "") => {
  const direct = args.find((arg) => arg.startsWith(`${name}=`));
  if (direct) return direct.slice(name.length + 1);

  const index = args.findIndex((arg) => arg === name);
  if (index >= 0 && args[index + 1]) return args[index + 1];

  return fallback;
};

const customer = getArgValue("--customer", "Unknown Customer");
const machineId = getArgValue("--machine", "*");
const outputPathArg = getArgValue("--out", "./license.json");
const daysArg = Number(getArgValue("--days", "30"));

const licenseSecret = process.env.LICENSE_SECRET;
if (!licenseSecret) {
  console.error(
    "❌ LICENSE_SECRET is required. Set it before generating a license file.",
  );
  process.exit(1);
}

if (!Number.isFinite(daysArg) || daysArg <= 0) {
  console.error("❌ --days must be a positive number.");
  process.exit(1);
}

const issuedAt = new Date();
const expiresAt = new Date(issuedAt.getTime() + daysArg * ONE_DAY_MS);

const payload = {
  customer,
  machineId,
  plan: "monthly",
  issuedAt: issuedAt.toISOString(),
  expiresAt: expiresAt.toISOString(),
};

const canonicalPayload = JSON.stringify({
  customer: payload.customer,
  issuedAt: payload.issuedAt,
  expiresAt: payload.expiresAt,
  machineId: payload.machineId,
  plan: payload.plan,
});

const signature = crypto
  .createHmac("sha256", licenseSecret)
  .update(canonicalPayload)
  .digest("hex");

const license = {
  payload,
  signature,
};

const outputPath = path.resolve(process.cwd(), outputPathArg);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(license, null, 2), "utf8");

console.log("✅ License generated successfully");
console.log(`Customer: ${customer}`);
console.log(`Machine ID: ${machineId}`);
console.log(`Valid Until: ${expiresAt.toISOString()}`);
console.log(`Output: ${outputPath}`);
