import { useSelector } from "react-redux";
import { dashboardApi } from "../../redux/api/dashboardAPI";
import { RootState } from "../../redux/store";
import { RevenueChart } from "./charts/lineChartCard";
import { CategoryDistribution } from "./charts/pieChartcard";
import { StatsGrid } from "./charts/statsgrid";
import { BarCharts } from "./charts/barChartcard";

// Default values for stats
const defaultStats = {
  revenue: { total: 0, lastMonth: 0, thisMonth: 0 },
  product: { total: 0, lastMonth: 0, thisMonth: 0 },
  user: { total: 0, lastMonth: 0, thisMonth: 0 },
  order: { total: 0, lastMonth: 0, thisMonth: 0 },
};

const defaultChangePercent = {
  revenue: 0,
  product: 0,
  user: 0,
  order: 0,
};

const Analytics = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const userId = user?._id;

  // Show a message if there is no user
  if (!userId) {
    return <div>Please log in to view analytics.</div>;
  }

  // API calls for different chart data
  const { data: stats } = dashboardApi.useStatsQuery(userId);
  const { data: line } = dashboardApi.useLineQuery(userId);
  const { data: bar } = dashboardApi.useBarQuery(userId);
  const { data: pie } = dashboardApi.usePieQuery(userId);

  // Pre-process data for clarity
  const statsData = stats?.stats?.count || defaultStats;
  const changePercentData = stats?.stats?.changePercent || defaultChangePercent;
  const revenueData = line?.charts?.revenue || [];
  const pieData = (pie?.charts?.productCategories || []).map(
    (category: Record<string, number>) => {
      const key = Object.keys(category)[0];
      return { name: key, value: category[key] };
    }
  );
  const barChartsData = {
    users: bar?.charts?.users || [],
    products: bar?.charts?.products || [],
    orders: bar?.charts?.orders || [],
  };

  return (
    <div className="p-4 space-y-8 font-primary">
      <StatsGrid data={statsData} changePercent={changePercentData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <CategoryDistribution data={pieData} />
      </div>

      <div className="grid grid-cols-1">
        <BarCharts charts={barChartsData} />
      </div>
    </div>
  );
};

export default Analytics;
