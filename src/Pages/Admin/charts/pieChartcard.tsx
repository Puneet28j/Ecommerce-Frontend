import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface CategoryDistributionProps {
  data: { name: string; value: number }[];
}

export const CategoryDistribution = ({ data }: CategoryDistributionProps) => (
  <div className=" p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data.map((entry) => ({
            name: Object.keys(entry)[0],
            value: Object.values(entry)[0],
          }))}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
