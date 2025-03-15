// components/OrdersTable/columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "./SortableHeader";
import { Order } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";

export const createColumns = (
  onViewOrder: (id: string) => void,
  onEditOrder: (id: string) => void
): ColumnDef<Order>[] => {
  return [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <SortableHeader column={column}>Order #</SortableHeader>
      ),
      cell: ({ row }) => (
        <Button
          variant="link"
          className="px-0 font-mono"
          onClick={() => onViewOrder(row.original._id)}
        >
          #{row.original._id.toUpperCase()}
        </Button>
      ),
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <SortableHeader column={column}>Customer</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row?.original?.user?.photo} />
            <AvatarFallback>
              {row?.original?.user?.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row?.original?.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {row?.original?.user?.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <SortableHeader column={column}>Total</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-start font-medium">
          ${row.original.total.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        const statusColors: Record<string, string> = {
          Processing: "bg-yellow-500/20 text-yellow-600",
          Shipped: "bg-blue-500/20 text-blue-600",
          Delivered: "bg-green-500/20 text-green-600",
        };
        return (
          <Badge
            className={
              statusColors[row.original.status] ||
              "bg-gray-500/20 text-gray-600"
            }
          >
            {row.original.status}
          </Badge>
        );
      },
      filterFn: "equals",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader column={column}>Date</SortableHeader>
      ),
      cell: ({ row }) => format(new Date(row.original.createdAt), "PPp"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewOrder(row.original._id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditOrder(row.original._id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
