import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { AlertCircle, PackageOpen } from "lucide-react";

// components/OrdersTable/TableStates.tsx
export const ErrorState = ({ message }: { message: string }) => (
  <div className="p-4 text-center text-destructive bg-destructive/10 rounded-lg">
    <AlertCircle className="mx-auto h-6 w-6 mb-2" />
    {message}
  </div>
);

export const TableSkeleton = ({
  colCount,
  rowCount,
}: {
  colCount: number;
  rowCount: number;
}) => (
  <>
    {Array.from({ length: rowCount }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: colCount }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-6 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export const EmptyState = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      <div className="flex flex-col items-center gap-2">
        <PackageOpen className="h-8 w-8 text-muted-foreground" />
        No orders found
      </div>
    </TableCell>
  </TableRow>
);
