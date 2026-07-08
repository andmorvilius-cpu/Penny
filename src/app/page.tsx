// Home screen. This becomes the month calendar in Feature 2 — until then it
// shows recent transactions so quick-add (Feature 1) can be tested.

import { getRecentTransactions } from "@/lib/data/transactions";
import { formatCents } from "@/lib/money";
import { formatDayShort } from "@/lib/dates";

export default async function HomePage() {
  const transactions = await getRecentTransactions();

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:px-8 md:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        The month calendar arrives with Feature 2. For now, here are your
        latest transactions so you can test quick-add.
      </p>

      <div className="mt-6">
        {transactions.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm dark:bg-stone-900">
            <p className="text-3xl">🪙</p>
            <p className="mt-2 text-sm font-medium">No transactions yet</p>
            <p className="mt-1 text-xs text-stone-400">
              Tap the + button to add your first one.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100 rounded-3xl bg-white shadow-sm dark:divide-stone-800 dark:bg-stone-900">
            {transactions.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: `${t.category.color}40` }}
                >
                  {t.category.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {t.note || t.category.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {t.category.name} · {formatDayShort(t.date)}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    t.type === "expense"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {t.type === "expense" ? "−" : "+"}
                  {formatCents(t.amountCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
