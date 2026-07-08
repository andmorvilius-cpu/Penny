// Read-side queries for categories. Server-only (enforced via lib/db).

import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/user";

/** All non-archived categories (parents and subcategories), A→Z. */
export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { userId: getCurrentUserId(), isArchived: false },
    orderBy: { name: "asc" },
  });
}
