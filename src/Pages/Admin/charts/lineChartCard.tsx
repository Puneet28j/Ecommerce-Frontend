import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatYAxisValue } from "../../../utils/features";
import { ChartConfig } from "@/components/ui/chart";

interface RevenueChartProps {
  data: number[];
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartData = months.map((month, index) => ({
    month,
    value: data[index] || 0,
  }));
  return (
    <div className="bg-black p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatYAxisValue} />
          <Tooltip
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />

          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const generateProductCategoriesConfig = (
  productCategories: Record<string, number>
) => {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const config: ChartConfig = {
    value: { label: "Product Categories" },
  };

  Object.keys(productCategories).forEach((category, index) => {
    // Format category names for display
    const formattedLabel = category
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    config[category] = {
      label: formattedLabel,
      color: colors[index % colors.length],
    };
  });

  return config;
};
