// Read-side queries for transactions. Server-only (enforced via lib/db).
// Keep these functions small and composable — a later phase will reuse them
// to build context for AI prompts.

import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user";

/** Most recent transactions, newest first, with their category attached. */
export async function getRecentTransactions(limit: number = 15) {
  return prisma.transaction.findMany({
    where: { userId: getCurrentUserId() },
    include: { category: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}
