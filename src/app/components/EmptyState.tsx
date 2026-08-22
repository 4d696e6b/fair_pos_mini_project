type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center text-zinc-400 ${className}`}
    >
      {message}
    </div>
  );
}
