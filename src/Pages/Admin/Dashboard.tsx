import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StatsGrid } from "./charts/statsgrid";
import { dashboardApi } from "../../redux/api/dashboardAPI";
import { StatsResponse } from "../../types/api-types";

const TOTAL_MONTHS_IN_YEAR = 12;
const defaultStats = {
  revenue: { total: 0, lastMonth: 0, thisMonth: 0 },
  product: { total: 0, lastMonth: 0, thisMonth: 0 },
  user: { total: 0, lastMonth: 0, thisMonth: 0 },
  order: { total: 0, lastMonth: 0, thisMonth: 0 },
};
const defaultChangePercent = { revenue: 0, product: 0, user: 0, order: 0 };
const chartConfig = {
  orders: { label: "Orders", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const formatChartData = (values: number[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return values.map((value, index) => {
    const monthsAgo = values.length - 1 - index;
    const monthIndex =
      (currentMonth - monthsAgo + TOTAL_MONTHS_IN_YEAR) % TOTAL_MONTHS_IN_YEAR;
    const yearOffset = monthIndex > currentMonth ? -1 : 0;
    return {
      month: new Date(currentYear + yearOffset, monthIndex).toLocaleString(
        "default",
        { month: "short" }
      ),
      value: value || 0,
    };
  });
};

type BarChartCardProps = {
  title: string;
  firstMonth: string;
  lastMonth: string;
  data: { month: string; value: number }[];
  stats: StatsResponse | undefined;
  dataKey: keyof StatsResponse["stats"]["chart"];
  unit: string;
};

const BarChartCard = ({
  title,
  firstMonth,
  lastMonth,
  data,
  stats,
  dataKey,
  unit,
}: BarChartCardProps) => {
  const changePercent = stats?.stats?.changePercent?.[dataKey] ?? 0;
  const absChangePercent = Math.abs(changePercent);
  const chartColor =
    chartConfig[dataKey === "revenue" ? "revenue" : "orders"].color;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{`${firstMonth} to ${lastMonth}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, "dataMax"]}
              tickCount={4}
              tickFormatter={(value) => `₹${value}`}
            />

            <ChartTooltip content={<ChartTooltipContent nameKey="month" />} />
            <Bar
              name={dataKey}
              dataKey="value"
              fill={chartColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {`This month achieved ${absChangePercent.toFixed(
            1
          )}% of ${unit} compared to last month`}
          <TrendingUp
            className={`h-4 w-4 ${
              changePercent >= 0 ? "text-green-500" : "text-red-500"
            }`}
          />
        </div>
        <div className="text-muted-foreground">
          Showing total {unit} for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

const Dashboard = () => {
  const userId = useSelector(
    (state: RootState) => state.userReducer.user?._id
  );
  const { isDemoMode } = useSelector((state: RootState) => state.demo);
  
  // Demo data for showcasing the dashboard
  const demoStats = {
    count: {
      revenue: { total: 125000, lastMonth: 45000, thisMonth: 52000 },
      product: { total: 156, lastMonth: 12, thisMonth: 18 },
      user: { total: 1234, lastMonth: 89, thisMonth: 124 },
      order: { total: 892, lastMonth: 156, thisMonth: 189 },
    },
    changePercent: { revenue: 15.5, product: 50, user: 39.3, order: 21.2 },
    chart: {
      order: [45, 52, 68, 72, 85, 92],
      revenue: [32000, 38000, 42000, 45000, 48000, 52000],
    },
  };

  // Use real API data if logged in as admin, otherwise use demo data
  const { data: stats } = dashboardApi.useStatsQuery(userId || "demo", {
    skip: isDemoMode && !userId,
  });

  // Use demo data if in demo mode or if stats aren't available
  const effectiveStats = isDemoMode && !stats ? { stats: demoStats } : stats;

  const orderData = formatChartData(effectiveStats?.stats?.chart?.order || []);
  const revenueData = formatChartData(effectiveStats?.stats?.chart?.revenue || []);
  const statsData = effectiveStats?.stats?.count || defaultStats;
  const changePercentData = effectiveStats?.stats?.changePercent || defaultChangePercent;
  const firstMonth = orderData?.[0]?.month || "";
  const lastMonth = orderData?.[orderData.length - 1]?.month || "";

  return (
    <main className="grid flex-1 gap-4 p-4 font-primary">
      <StatsGrid data={statsData} changePercent={changePercentData} />
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartCard
          title="Orders"
          firstMonth={firstMonth}
          lastMonth={lastMonth}
          data={orderData}
          stats={stats}
          dataKey="order"
          unit="orders"
        />
        <BarChartCard
          title="Revenue"
          firstMonth={firstMonth}
          lastMonth={lastMonth}
          data={revenueData}
          stats={stats}
          dataKey="revenue"
          unit="revenue"
        />
      </div>
    </main>
  );
};

export default Dashboard;
