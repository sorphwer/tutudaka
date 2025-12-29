interface HeaderProps {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}

const monthFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
});

export function Header({ month, onPrev, onNext }: HeaderProps) {
  const title = monthFormatter.format(month).replace(" ", "");

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-gray-200 backdrop-blur dark:bg-gray-900/70 dark:ring-gray-800">
      <button
        type="button"
        onClick={onPrev}
        aria-label="上个月"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 transition hover:-translate-x-0.5 hover:shadow-md active:scale-[0.97] dark:bg-gray-800 dark:ring-gray-700"
      >
        ←
      </button>
      <div className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        {title}
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label="下个月"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 transition hover:translate-x-0.5 hover:shadow-md active:scale-[0.97] dark:bg-gray-800 dark:ring-gray-700"
      >
        →
      </button>
    </header>
  );
}
