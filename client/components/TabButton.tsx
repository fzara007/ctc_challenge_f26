export function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-500 text-white shadow-sm'
          : 'text-gray-600 hover:bg-brand-50'
      }`}
    >
      {label}
    </button>
  );
}