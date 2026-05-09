const { validateLicense } = require("../utils/license");

const licenseEnforcement = (req, res, next) => {
  const status = validateLicense();

  if (status.warning) {
    res.setHeader("x-license-warning", status.message);
    res.setHeader("x-license-days-left", String(status.daysLeft ?? 0));
  }

  if (status.blocked) {
    return res.status(403).json({
      message: status.message,
      code: status.code,
      license: {
        expiresAt: status.expiresAt,
        graceEndsAt: status.graceEndsAt,
      },
    });
  }

  return next();
};

const licenseStatusHandler = (req, res) => {
  const status = validateLicense();

  return res.status(200).json({
    valid: status.valid,
    blocked: status.blocked,
    warning: status.warning,
    message: status.message,
    code: status.code,
    daysLeft: status.daysLeft,
    expiresAt: status.expiresAt,
    graceEndsAt: status.graceEndsAt,
    licensePath: status.path,
    payload: status.payload,
  });
};

module.exports = {
  licenseEnforcement,
  licenseStatusHandler,
};
