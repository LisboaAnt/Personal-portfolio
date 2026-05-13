export default function LabLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-16 sm:px-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--border)]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--border)]" />
      <div className="h-40 animate-pulse rounded-2xl bg-[var(--border)]" />
    </div>
  );
}
