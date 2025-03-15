import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import { Button } from "../../../components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/ui/chart";
import { useMediaQuery } from "react-responsive";
import { BarChart, Package, ShoppingBag, Users } from "lucide-react";
import { formatYAxisValue } from "../../../utils/features";

// Define prop types
type BarChartsProps = {
  charts: {
    users: number[];
    products: number[];
    orders: number[];
  };
};

// Chart configuration
const chartConfig = {
  users: { label: "Users", color: "#4F46E5" }, // Indigo
  products: { label: "Products", color: "#22C55E" }, // Green
  orders: { label: "Orders", color: "#EF4444" }, // Red
  combined: { label: "Combined", color: "#000000" }, // Neutral (for the button)
};

export const BarCharts = ({ charts }: BarChartsProps) => {
  const chartIcons = {
    users: <Users className="w-5 h-5" />,
    products: <ShoppingBag className="w-5 h-5" />,
    orders: <Package className="w-5 h-5" />,
    combined: <BarChart className="w-5 h-5" />, // Icon for combined chart
  };

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("orders");

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Generate chart data with month labels
  const chartData = charts.orders.map((_, index) => {
    const monthsAgo = charts.orders.length - 1 - index;
    let monthIndex = (currentMonth - monthsAgo + 12) % 12;
    const yearOffset = monthIndex > currentMonth ? -1 : 0;
    const year = currentYear + yearOffset;

    const monthFormat = isPortrait ? "short" : "long";
    return {
      month: new Date(year, monthIndex).toLocaleString("default", {
        month: monthFormat,
      }),
      users: charts.users[index] || 0,
      products: charts.products[index] || 0,
      orders: charts.orders[index] || 0,
    };
  });

  // Calculate total for each category
  const total = React.useMemo(
    () => ({
      users: charts.users.reduce((acc, curr) => acc + curr, 0),
      products: charts.products.reduce((acc, curr) => acc + curr, 0),
      orders: charts.orders.reduce((acc, curr) => acc + curr, 0),
    }),
    [charts]
  );

  return (
    <Card className="w-full">
      <CardHeader className="border-b p-4 sm:flex sm:items-center sm:justify-between">
        <div className="text-start">
          <CardTitle>{` ${chartConfig[activeChart].label} count`}</CardTitle>
          <CardDescription>Last 12 months of data</CardDescription>
        </div>
        <div className="flex space-x-2 sm:space-x-4 overflow-y-scroll ">
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <Button
                key={chart}
                aria-pressed={activeChart === chart}
                className={`group flex items-center justify-between px-4 py-2 rounded-md transition-colors
                ${
                  activeChart === chart
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-accent text-muted-foreground"
                }`}
                onClick={() => setActiveChart(chart)}
              >
                {isPortrait ? (
                  chartIcons[chart] // Show icons in portrait mode
                ) : (
                  <span className="text-sm font-medium">
                    {chartConfig[chart].label}
                  </span>
                )}
                {chart !== "combined" && (
                  <span className="ml-3 text-lg font-semibold group-hover:scale-105 transition-transform">
                    {formatYAxisValue(total[chart])}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full   ">
          <LineChart data={chartData} margin={{ left: 0, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ right: 20 }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, "dataMax "]}
              padding={{ top: 20 }}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={formatYAxisValue}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="month"
                  labelFormatter={(value) => value} // Use value directly instead of converting to a Date
                />
              }
            />

            <Legend />
            {activeChart === "combined" ? (
              // Render all three lines if "Combined" is selected
              <>
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke={chartConfig.users.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="products"
                  stroke={chartConfig.products.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke={chartConfig.orders.color}
                  strokeWidth={2}
                  dot={false}
                />
              </>
            ) : (
              // Render only the selected category
              <Line
                type="monotone"
                dataKey={activeChart}
                stroke={chartConfig[activeChart].color}
                strokeWidth={6}
                dot={false}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
