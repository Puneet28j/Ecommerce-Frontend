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
