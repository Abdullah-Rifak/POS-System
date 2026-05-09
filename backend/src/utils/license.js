const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const config = require("../config/config");

const LICENSE_FILE_NAME = "license.json";
const GRACE_DAYS = 7;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const canonicalizePayload = (payload) => {
  return JSON.stringify({
    customer: payload.customer,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
    machineId: payload.machineId || "*",
    plan: payload.plan || "monthly",
  });
};

const buildSignature = (payload) => {
  return crypto
    .createHmac("sha256", config.LICENSE_SECRET)
    .update(canonicalizePayload(payload))
    .digest("hex");
};

const getLicensePath = () => {
  return path.join(config.appConfigDir, LICENSE_FILE_NAME);
};

const readLicenseFile = () => {
  const licensePath = getLicensePath();
  if (!fs.existsSync(licensePath)) {
    return {
      exists: false,
      error: "License file not found",
      path: licensePath,
    };
  }

  try {
    const content = fs.readFileSync(licensePath, "utf8");
    const parsed = JSON.parse(content);
    return { exists: true, data: parsed, path: licensePath };
  } catch (error) {
    return {
      exists: true,
      error: "License file is not valid JSON",
      path: licensePath,
      details: error.message,
    };
  }
};

const validateLicense = () => {
  const now = new Date();
  const rawLicense = readLicenseFile();

  if (!rawLicense.exists) {
    return {
      valid: false,
      blocked: true,
      warning: false,
      message: "License not found. Please install a valid license file.",
      code: "LICENSE_MISSING",
      path: rawLicense.path,
    };
  }

  if (rawLicense.error) {
    return {
      valid: false,
      blocked: true,
      warning: false,
      message: "License is invalid. Please install a valid license file.",
      code: "LICENSE_INVALID",
      details: rawLicense.details,
      path: rawLicense.path,
    };
  }

  const license = rawLicense.data;

  if (!license?.payload || !license?.signature) {
    return {
      valid: false,
      blocked: true,
      warning: false,
      message: "License format is invalid.",
      code: "LICENSE_INVALID",
      path: rawLicense.path,
    };
  }

  const expectedSignature = buildSignature(license.payload);
  if (expectedSignature !== license.signature) {
    return {
      valid: false,
      blocked: true,
      warning: false,
      message: "License signature verification failed.",
      code: "LICENSE_INVALID_SIGNATURE",
      path: rawLicense.path,
    };
  }

  const expiresAt = new Date(license.payload.expiresAt);
  if (Number.isNaN(expiresAt.getTime())) {
    return {
      valid: false,
      blocked: true,
      warning: false,
      message: "License expiry date is invalid.",
      code: "LICENSE_INVALID_EXPIRY",
      path: rawLicense.path,
    };
  }

  const graceEndsAt = new Date(expiresAt.getTime() + GRACE_DAYS * ONE_DAY_MS);

  if (now <= expiresAt) {
    return {
      valid: true,
      blocked: false,
      warning: false,
      message: "License is active.",
      code: "LICENSE_ACTIVE",
      expiresAt,
      graceEndsAt,
      payload: license.payload,
      path: rawLicense.path,
    };
  }

  if (now > expiresAt && now <= graceEndsAt) {
    return {
      valid: true,
      blocked: false,
      warning: true,
      message:
        "License has expired. If you don't renew the license within 7 days, system won't work.",
      code: "LICENSE_GRACE_PERIOD",
      expiresAt,
      graceEndsAt,
      daysLeft: Math.max(0, Math.ceil((graceEndsAt - now) / ONE_DAY_MS)),
      payload: license.payload,
      path: rawLicense.path,
    };
  }

  return {
    valid: false,
    blocked: true,
    warning: false,
    message:
      "License grace period ended. System is blocked until a new license is installed.",
    code: "LICENSE_BLOCKED",
    expiresAt,
    graceEndsAt,
    payload: license.payload,
    path: rawLicense.path,
  };
};

module.exports = {
  validateLicense,
  buildSignature,
  canonicalizePayload,
  getLicensePath,
};
