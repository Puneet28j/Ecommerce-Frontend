// components/filters/filter-chip.tsx
import { X } from "lucide-react";
import { useCallback } from "react";

interface FilterChipProps {
  label: string;
  value: string;
  onReset: () => void;
}

export const FilterChip = ({ label, value, onReset }: FilterChipProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        onReset();
      }
    },
    [onReset]
  );

  return (
    <div className="bg-accent/20 text-foreground px-2.5 py-1 rounded-full text-sm flex items-center gap-1.5 group transition-colors hover:bg-accent/30">
      <span className="truncate max-w-[180px]">
        <span className="font-medium">{label}:</span> {value}
      </span>
      <button
        onClick={onReset}
        onKeyDown={handleKeyDown}
        className="opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
        aria-label={`Remove ${label} filter`}
        tabIndex={0}
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
};
