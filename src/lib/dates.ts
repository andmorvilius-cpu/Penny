// Date convention for the whole app:
//
// A transaction belongs to a *calendar day* ("2026-07-08"), not an instant in
// time. We store that day as UTC midnight in the database and ALWAYS read it
// back with UTC getters (or these helpers). That way the day never shifts
// when the server or browser is in a different timezone.

/** Today's date as "YYYY-MM-DD" in the *local* timezone (what the user considers today). */
export function todayDateString(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** "2026-07-08" -> Date at 2026-07-08T00:00:00.000Z, for storing in the db. */
export function dateStringToUTCDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

/** Date from the db -> "2026-07-08". */
export function dateToDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Date from the db -> "Jul 8" for compact display. */
export function formatDayShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC", // read back with UTC, see note at top
  });
}
