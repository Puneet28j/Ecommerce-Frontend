import { useSelector } from "react-redux";
import { dashboardApi } from "../../redux/api/dashboardAPI";
import { RootState } from "../../redux/store";
import PieChartCard from "./charts/pieChartcard";
import { StatsGrid } from "./charts/statsgrid";
import { BarCharts } from "./charts/barChartcard";
import {
  orderStatusConfig,
  revenueDistributionConfig,
  stockAvailabilityConfig,
  userAgeConfig,
} from "./charts/chartsConfig";
import { generateProductCategoriesConfig } from "./charts/lineChartCard";

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
  // const { data: line } = dashboardApi.useLineQuery(userId);
  const { data: bar } = dashboardApi.useBarQuery(userId);
  const { data: pie } = dashboardApi.usePieQuery(userId);

  // Pre-process data for clarity
  const statsData = stats?.stats?.count || defaultStats;
  const changePercentData = stats?.stats?.changePercent || defaultChangePercent;
  // const revenueData = line?.charts?.revenue || [];

  const barChartsData = {
    users: bar?.charts?.users || [],
    products: bar?.charts?.products || [],
    orders: bar?.charts?.orders || [],
  };

  const ageData = Object.entries(pie?.charts?.usersAgeGroup! || {}).map(
    ([ageGroup, count]) => ({
      name: ageGroup,
      value: count,
    })
  );
  const orderStatusData = Object.entries(
    pie?.charts?.orderFullfillment! || {}
  ).map(([orderStatus, count]) => ({
    name: orderStatus,
    value: count,
  }));
  const revenueDistributionData = Object.entries(
    pie?.charts?.revenueDistribution! || {}
  ).map(([revenueDistributionType, count]) => ({
    name: revenueDistributionType,
    value: count,
  }));

  console.log(revenueDistributionData, "revenueDistributionConfig");

  const stockAvailabilityData = Object.entries(
    pie?.charts?.stockAvailability! || {}
  ).map(([stockAvailability, count]) => ({
    name: stockAvailability,
    value: count,
  }));
  const productCategoryData = (pie?.charts?.productCategories || []).map(
    (category: Record<string, number>) => {
      const key = Object.keys(category)[0];
      return { name: key, value: category[key] };
    }
  );

  const productCategoriesConfig = generateProductCategoriesConfig(
    (pie?.charts?.productCategories || []).reduce((acc, category) => {
      const key = Object.keys(category)[0];
      acc[key] = category[key];
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <div className="p-4 space-y-8 font-primary">
      <StatsGrid data={statsData} changePercent={changePercentData} />

      <div className="grid grid-cols-1">
        <BarCharts charts={barChartsData} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-4">
        {pie?.charts?.usersAgeGroup && (
          <PieChartCard
            title="Users"
            description="Showing Users Age Group"
            dataKey="value"
            nameKey="name"
            trend={5.2}
            footerNote="Showing Users Age Group"
            config={userAgeConfig}
            data={ageData}
            legend={true}
          />
        )}
        {pie?.charts?.orderFullfillment && (
          <PieChartCard
            title="Orders"
            description="Showing Orderfullfillment"
            dataKey="value"
            nameKey="name"
            trend={5.2}
            footerNote="Showing Orderfullfillment"
            config={orderStatusConfig}
            data={orderStatusData}
            legend={true}
          />
        )}
        {pie?.charts?.revenueDistribution && (
          <PieChartCard
            title="Revenue"
            description="Showing Revenue Distribution"
            dataKey="value"
            nameKey="name"
            trend={5.2}
            footerNote="Showing Revenue Distribution"
            config={revenueDistributionConfig}
            data={revenueDistributionData}
            legend={true}
          />
        )}
        {pie?.charts?.stockAvailability && (
          <PieChartCard
            title="Stock"
            description="Showing Stock Distribution"
            dataKey="value"
            nameKey="name"
            trend={5.2}
            footerNote="Stock Distribution"
            config={stockAvailabilityConfig}
            data={stockAvailabilityData}
            legend={false}
          />
        )}
        {pie?.charts?.productCategories && (
          <PieChartCard
            title="Stock Distribution"
            description="Showing Product Categories"
            dataKey="value"
            nameKey="name"
            trend={5.2}
            footerNote="Showing Product Categories Distribution"
            config={productCategoriesConfig}
            data={productCategoryData}
            legend={true}
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pie?.charts?.productCategories && (
          <PieChartCard
            title="Stock Distribution"
            description="January - June 2024"
            dataKey="value"
            nameKey="name"
            trend={5.2}
            footerNote="Showing total visitors for the last 6 months"
            config={productCategoriesConfig}
            data={productCategoryData}
            legend={false}
          />
        )}
        {pie?.charts?.revenueDistribution && (
          <PieChartCard
            title="Revenue"
            description="Showing Revenue Distribution"
            dataKey="value"
            nameKey="name"
            trend={5.2}
            footerNote="Showing Revenue Distribution"
            config={revenueDistributionConfig}
            data={revenueDistributionData}
            legend={false}
          />
        )}
      </div>
    </div>
  );
};

export default Analytics;
