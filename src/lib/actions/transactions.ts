// Server actions (mutations) for transactions.
//
// Pattern used by every action in this app:
//   1. Parse the input with Zod — reject anything malformed.
//   2. Check the referenced rows belong to the current user.
//   3. Write via Prisma.
//   4. revalidatePath() so pages showing this data re-render with fresh data.
// Actions return { ok } / { ok, error } instead of throwing, so forms can
// show friendly error messages.

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user";
import { transactionInputSchema } from "@/lib/validation";
import { dateStringToUTCDate } from "@/lib/dates";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createTransaction(input: unknown): Promise<ActionResult> {
  const parsed = transactionInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { amountCents, type, categoryId, note, date } = parsed.data;
  const userId = getCurrentUserId();

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId, isArchived: false },
  });
  if (!category) {
    return { ok: false, error: "Category not found" };
  }

  await prisma.transaction.create({
    data: {
      userId,
      amountCents,
      type,
      categoryId,
      note: note || null,
      date: dateStringToUTCDate(date),
    },
  });

  revalidatePath("/");
  return { ok: true };
}
