# License Setup (Monthly Renewal)

This POS system now enforces a monthly license with a 7-day grace period.

## Behavior

- License valid for 30 days (or custom days when generating).
- After expiry, users can still use the system for **7 days** and see this warning:
  - `If you don't renew the license within 7 days, system won't work.`
- After grace period, backend blocks all business APIs until a new license is installed.

## 1) Set License Secret (must match generator + client app)

Use the same secret value for generating and validating licenses:

PowerShell example:

```powershell
$env:LICENSE_SECRET = "your-strong-secret-here"
```

> Keep this secret private. Use a strong unique value.

## 2) Generate Monthly License

From `backend` folder:

```powershell
npm run generate:license -- --customer "Client A" --machine "CLIENT-PC-01" --days 30 --out "./license.json"
```

This creates a signed `license.json` file.

## 3) Paste License on Client PC

Copy `license.json` to:

- `C:\Users\<WindowsUser>\AppData\Roaming\pos-system\license.json`

(Equivalent location read by the app in `%APPDATA%\pos-system\license.json`)

## 4) Check License Status

Call:

- `GET http://127.0.0.1:5000/license/status`

It returns current state (`active`, `warning/grace`, or `blocked`) and dates.

## Notes

- If `license.json` is missing/invalid, system is blocked.
- Renewal process: generate new signed file every month and replace old `license.json` on client PC.
