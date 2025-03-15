// components/OrdersTable/SortableHeader.tsx
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TData> {
  column: Column<TData>;
  children: React.ReactNode;
}

export const SortableHeader = <TData,>({
  column,
  children,
}: SortableHeaderProps<TData>) => (
  <div
    onClick={column.getToggleSortingHandler()}
    className="cursor-pointer select-none flex items-center gap-1 hover:bg-accent/50 px-3 py-2 rounded"
  >
    {children}
    {{
      asc: <FaSortUp className="h-4 w-4" />,
      desc: <FaSortDown className="h-4 w-4" />,
    }[column.getIsSorted() as string] ?? (
      <FaSort className="h-4 w-4 text-muted-foreground" />
    )}
  </div>
);
