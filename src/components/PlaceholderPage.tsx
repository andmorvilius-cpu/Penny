// Simple placeholder used by screens whose feature hasn't been built yet.

export default function PlaceholderPage({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:px-8 md:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-6 rounded-3xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-400 dark:border-stone-700 dark:text-stone-500">
        {note}
      </div>
    </div>
  );
}
