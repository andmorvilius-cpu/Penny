// All money in this app is integer cents. This file is the ONLY place that
// converts between cents and user-facing strings. Never use floats or
// parseFloat for money anywhere else — floating point can't represent values
// like 0.1 exactly, which corrupts totals.

/** 1250 -> "$12.50", -1250 -> "-$12.50". Pure integer math. */
export function formatCents(cents: number, symbol: string = "$"): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  return `${sign}${symbol}${dollars.toLocaleString("en-US")}.${String(
    remainder
  ).padStart(2, "0")}`;
}

/**
 * Parses user input like "12.50", "12", ".5" or "1,250.00" into cents.
 * Returns null for anything that isn't a valid amount (so callers can show
 * a validation error instead of guessing).
 */
export function parseAmountToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  // digits, optionally followed by "." and at most 2 more digits
  if (!/^\d*(\.\d{0,2})?$/.test(cleaned)) return null;
  if (cleaned === "" || cleaned === ".") return null;

  const [wholePart, fractionPart = ""] = cleaned.split(".");
  const dollars = wholePart === "" ? 0 : parseInt(wholePart, 10);
  const cents = fractionPart === "" ? 0 : parseInt(fractionPart.padEnd(2, "0"), 10);
  return dollars * 100 + cents;
}
