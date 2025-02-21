import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import { useSelector } from "react-redux";
import { ChartConfig } from "../../components/ui/chart";
import { dashboardApi } from "../../redux/api/dashboardAPI";
import { RootState } from "../../redux/store";
import { LineChartCard } from "./charts/lineChartCard";
import PieChartCard from "./charts/pieChartcard";

const Analytics = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data } = dashboardApi.usePieQuery(user?._id!);

  const order = data?.charts?.orderFullfillment!;
  const categories = data?.charts?.productCategories!;
  const stock = data?.charts?.stockAvailability!;
  const revenue = data?.charts?.revenueDistribution!;
  const ageGroup = data?.charts?.usersAgeGroup!;
  const adminCustomer = data?.charts?.adminCustomer!;
  console.log(categories, stock, revenue, ageGroup, adminCustomer);

  const chartDataLine = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  const chartConfigLine = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const orderStatus = [
    {
      status: "processing",
      value: order?.processing || 0,
      fill: "var(--color-chrome)",
    },
    {
      status: "shipped",
      value: order?.shipped || 0,
      fill: "var(--color-safari)",
    },
    {
      status: "delivered",
      value: order?.delivered || 0,
      fill: "var(--color-firefox)",
    },
  ];
  const ageGroupData = [
    {
      status: "teen",
      value: ageGroup.teen || 0,
      fill: "var(--color-chrome)",
    },
    {
      status: "adult",
      value: ageGroup?.adult || 0,
      fill: "var(--color-safari)",
    },
    {
      status: "old",
      value: ageGroup?.old || 0,
      fill: "var(--color-firefox)",
    },
  ];
  const stockStatusData = [
    {
      status: "inStock",
      value: stock.inStock || 0,
      fill: "var(--color-chrome)",
    },
    {
      status: "outOfStock",
      value: stock?.outofStock || 0,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
    processing: {
      label: "Processing",
      color: "hsl(var(--chart-1))",
    },
    delivered: {
      label: "Delivered",
      color: "hsl(var(--chart-2))",
    },
    shipped: {
      label: "Shipped",
      color: "hsl(var(--chart-3))",
    },
    teen: {
      label: "Teen",
      color: "var(--color-chrome)",
    },
    adult: {
      label: "Adult",
      color: "var(--color-safari)",
    },
    old: {
      label: "Old",
      color: "var(--color-firefox)",
    },
    inStock: {
      label: "InStock",
      color: "var(--color-firefox)",
    },
    outOfStock: {
      label: "OutofStock",
      color: "var(--color-firefox)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <div>
        <Tabs defaultValue="pieChart">
          <TabsList className="m-4">
            <TabsTrigger value="pieChart">Pie Chart</TabsTrigger>
            <TabsTrigger value="lineChart">Line chart</TabsTrigger>
          </TabsList>
          <TabsContent value="pieChart">
            <div className="grid  grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 m-4">
              <PieChartCard
                title="Pie Chart - Donut Active"
                description="January - June 2024"
                chartData={orderStatus}
                chartConfig={chartConfig}
              />
              <PieChartCard
                title="Age Group Data"
                description="January - June 2024"
                chartData={ageGroupData}
                chartConfig={chartConfig}
              />
              <PieChartCard
                title="Pie Chart - Donut Active"
                description="January - June 2024"
                chartData={stockStatusData}
                chartConfig={chartConfig}
              />
              <PieChartCard
                title="Pie Chart - Donut Active"
                description="January - June 2024"
                chartData={orderStatus}
                chartConfig={chartConfig}
              />
              <PieChartCard
                title="Pie Chart - Donut Active"
                description="January - June 2024"
                chartData={orderStatus}
                chartConfig={chartConfig}
              />
              <PieChartCard
                title="Pie Chart - Donut Active"
                description="January - June 2024"
                chartData={orderStatus}
                chartConfig={chartConfig}
              />
            </div>
          </TabsContent>
          <TabsContent value="lineChart">
            <div className="grid  grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 m-4">
              {Array(6)
                .fill("", 0, 6)
                .map((_, index) => (
                  <LineChartCard
                    key={index}
                    title="Pie Chart - Donut Active"
                    description="January - June 2024"
                    chartData={chartDataLine}
                    chartConfig={chartConfigLine}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Analytics;
