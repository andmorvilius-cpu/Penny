// Zod schemas for every user input. Server actions parse their input with
// these before touching the database — never trust what the client sends,
// even our own forms.

import { z } from "zod";

export const transactionInputSchema = z.object({
  amountCents: z
    .number()
    .int("Amounts must be whole cents")
    .positive("Amount must be greater than zero")
    .max(99_999_999, "Amount is too large"),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().min(1, "Pick a category"),
  note: z.string().trim().max(200, "Note is too long").optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
