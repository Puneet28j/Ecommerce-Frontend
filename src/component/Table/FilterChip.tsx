import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  value: string;
  onReset: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  value,
  onReset,
}) => (
  <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs flex items-center gap-1 group">
    <span className="truncate max-w-[150px]">
      {label}: {value}
    </span>
    <button
      onClick={onReset}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      title={`Clear ${label} filter`}
    >
      <X className="size-3" />
    </button>
  </div>
);
