import { ChartConfig } from "@/components/ui/chart";

//Pie chart configs ///////////////////////////////////////////////////////////////////////
export const userAgeConfig = {
  value: {
    label: "Age Group",
  },
  teen: {
    label: "Teen",
    color: "hsl(var(--chart-1))",
  },
  adult: {
    label: "Adult",
    color: "hsl(var(--chart-2))",
  },
  old: {
    label: "Old",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export const orderStatusConfig = {
  value: {
    label: "Order Status",
  },
  processing: {
    label: "Processing",
    color: "hsl(var(--chart-1))",
  },
  shipped: {
    label: "Shipped",
    color: "hsl(var(--chart-2))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export const revenueDistributionConfig = {
  value: {
    label: "Revenue",
  },
  netMargin: {
    label: "Net margin",
    color: "hsl(var(--chart-1))",
  },
  discount: {
    label: "Discount",
    color: "hsl(var(--chart-2))",
  },
  productionCost: {
    label: "Production Cost",
    color: "hsl(var(--chart-3))",
  },
  burnt: {
    label: "Burnt",
    color: "hsl(var(--chart-4))",
  },
  marketingCost: {
    label: "Marketing Cost",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export const stockAvailabilityConfig = {
  value: {
    label: "Stock Availability",
  },
  inStock: {
    label: "In stock",
    color: "hsl(var(--chart-1))",
  },
  outofStock: {
    label: "Out of stock",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const productCategoriesConfig = {
  value: {
    label: "Product Categories",
  },
  inStock: {
    label: "In stock",
    color: "hsl(var(--chart-1))",
  },
  outofStock: {
    label: "Out of stock",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
