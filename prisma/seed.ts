// Seeds the default categories for the local user. Idempotent: if the user
// already has categories, it does nothing, so it's safe to run repeatedly.
// Runs automatically after `prisma migrate dev` sets up a fresh database.

import { PrismaClient } from "../src/generated/prisma/client";
import { LOCAL_USER_ID } from "../src/lib/user";

const prisma = new PrismaClient();

type SeedCategory = {
  name: string;
  icon: string;
  color: string;
  children: { name: string; icon: string }[];
};

// Student-friendly defaults. Subcategories inherit the parent's color.
const defaultCategories: SeedCategory[] = [
  {
    name: "Food & Dining",
    icon: "🍜",
    color: "#F9A8A8",
    children: [
      { name: "Coffee", icon: "☕" },
      { name: "Restaurants", icon: "🍽️" },
      { name: "Takeout", icon: "🍕" },
      { name: "Snacks", icon: "🍫" },
    ],
  },
  {
    name: "Groceries",
    icon: "🛒",
    color: "#FBD38D",
    children: [],
  },
  {
    name: "Rent & Housing",
    icon: "🏠",
    color: "#C4B5FD",
    children: [
      { name: "Rent", icon: "🔑" },
      { name: "Utilities", icon: "💡" },
      { name: "Internet", icon: "📶" },
    ],
  },
  {
    name: "Transportation",
    icon: "🚌",
    color: "#93C5FD",
    children: [
      { name: "Public Transit", icon: "🚇" },
      { name: "Gas", icon: "⛽" },
      { name: "Rideshare", icon: "🚕" },
    ],
  },
  {
    name: "Subscriptions",
    icon: "🔁",
    color: "#A5B4FC",
    children: [
      { name: "Streaming", icon: "🎬" },
      { name: "Music", icon: "🎧" },
      { name: "Software", icon: "💻" },
    ],
  },
  {
    name: "Entertainment",
    icon: "🎉",
    color: "#F0ABFC",
    children: [
      { name: "Movies", icon: "🍿" },
      { name: "Games", icon: "🎮" },
      { name: "Going Out", icon: "🥳" },
    ],
  },
  {
    name: "Shopping",
    icon: "🛍️",
    color: "#FDA4AF",
    children: [
      { name: "Clothes", icon: "👕" },
      { name: "Tech", icon: "📱" },
      { name: "Gifts", icon: "🎁" },
    ],
  },
  {
    name: "Education",
    icon: "📚",
    color: "#86EFAC",
    children: [
      { name: "Textbooks", icon: "📖" },
      { name: "Tuition & Fees", icon: "🎓" },
      { name: "Supplies", icon: "✏️" },
    ],
  },
  {
    name: "Health",
    icon: "🩺",
    color: "#5EEAD4",
    children: [
      { name: "Pharmacy", icon: "💊" },
      { name: "Gym", icon: "🏋️" },
      { name: "Doctor", icon: "🏥" },
    ],
  },
  {
    name: "Income",
    icon: "💰",
    color: "#6EE7B7",
    children: [
      { name: "Paycheck", icon: "💵" },
      { name: "Family Support", icon: "🎁" },
      { name: "Scholarship", icon: "🎓" },
      { name: "Side Hustle", icon: "💼" },
    ],
  },
];

async function main() {
  const existing = await prisma.category.count({
    where: { userId: LOCAL_USER_ID },
  });
  if (existing > 0) {
    console.log(`Found ${existing} categories — skipping seed.`);
    return;
  }

  for (const { children, ...parentData } of defaultCategories) {
    const parent = await prisma.category.create({
      data: { ...parentData, userId: LOCAL_USER_ID, isDefault: true },
    });
    for (const child of children) {
      await prisma.category.create({
        data: {
          ...child,
          color: parent.color,
          parentCategoryId: parent.id,
          userId: LOCAL_USER_ID,
          isDefault: true,
        },
      });
    }
  }
  console.log(`Seeded ${defaultCategories.length} default categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
