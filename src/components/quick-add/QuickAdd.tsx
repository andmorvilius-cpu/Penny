"use client";

// Quick-add transaction: a floating + button that opens a bottom sheet
// (centered dialog on bigger screens). Optimized for speed — amount is
// auto-focused, categories are a tap-once grid, date defaults to today.
//
// This is a client component for the form state; the actual database write
// happens in the createTransaction server action.

import { useMemo, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import type { Category } from "@/generated/prisma/client";
import { createTransaction } from "@/lib/actions/transactions";
import { parseAmountToCents } from "@/lib/money";
import { todayDateString } from "@/lib/dates";

type TransactionType = "expense" | "income";

export default function QuickAdd({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayDateString());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Grid shows top-level categories; picking one reveals its subcategories
  // as optional chips below.
  const parents = useMemo(
    () => categories.filter((c) => c.parentCategoryId === null),
    [categories]
  );
  const subcategories = useMemo(
    () => categories.filter((c) => c.parentCategoryId === parentId),
    [categories, parentId]
  );
  const selectedParent = parents.find((c) => c.id === parentId);
  const categoryId = childId ?? parentId;

  function resetForm() {
    setAmount("");
    setNote("");
    setParentId(null);
    setChildId(null);
    setDate(todayDateString());
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountCents = parseAmountToCents(amount);
    if (amountCents === null || amountCents === 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!categoryId) {
      setError("Pick a category");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createTransaction({
        amountCents,
        type,
        categoryId,
        note: note.trim() || undefined,
        date,
      });
      if (result.ok) {
        resetForm();
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Add transaction"
        className="fixed right-4 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 active:scale-95 md:right-8 md:bottom-8"
      >
        <Plus className="h-7 w-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          {/* Backdrop — click to dismiss */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add transaction"
            className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-xl sm:rounded-3xl sm:pb-5 dark:bg-stone-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Add transaction</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Expense / income toggle */}
              <div className="grid grid-cols-2 gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-full py-2 text-sm font-medium capitalize transition ${
                      type === t
                        ? t === "expense"
                          ? "bg-white text-rose-600 shadow-sm dark:bg-stone-700 dark:text-rose-400"
                          : "bg-white text-emerald-600 shadow-sm dark:bg-stone-700 dark:text-emerald-400"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-medium text-stone-400">$</span>
                <input
                  autoFocus
                  inputMode="decimal"
                  placeholder="0.00"
                  aria-label="Amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  className="w-44 bg-transparent text-center text-5xl font-semibold tracking-tight outline-none placeholder:text-stone-300 dark:placeholder:text-stone-600"
                />
              </div>

              {/* Category grid (top-level) */}
              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-stone-400 uppercase">
                  Category
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {parents.map((cat) => {
                    const selected = cat.id === parentId;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setParentId(cat.id);
                          setChildId(null);
                          setError(null);
                        }}
                        className={`flex flex-col items-center gap-1 rounded-2xl p-2 transition ${
                          selected
                            ? "bg-stone-100 ring-2 ring-emerald-400 dark:bg-stone-800"
                            : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
                        }`}
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                          style={{ backgroundColor: `${cat.color}40` }}
                        >
                          {cat.icon}
                        </span>
                        <span className="w-full truncate text-center text-[11px] leading-tight text-stone-600 dark:text-stone-300">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional subcategory refinement */}
              {selectedParent && subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setChildId(null)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      childId === null
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "border-stone-200 text-stone-500 dark:border-stone-700 dark:text-stone-400"
                    }`}
                  >
                    {selectedParent.icon} General
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setChildId(sub.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        childId === sub.id
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "border-stone-200 text-stone-500 dark:border-stone-700 dark:text-stone-400"
                      }`}
                    >
                      {sub.icon} {sub.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Note + date */}
              <div className="flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note (optional)"
                  className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-emerald-400 dark:border-stone-700"
                />
                <input
                  type="date"
                  aria-label="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-emerald-400 dark:border-stone-700 dark:[color-scheme:dark]"
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                {isPending
                  ? "Adding…"
                  : type === "expense"
                    ? "Add expense"
                    : "Add income"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
