import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  ShoppingCart,
  Users,
  Package,
  IndianRupeeIcon,
} from "lucide-react";
import { Stats } from "../../../types/types";

interface StatsGridProps {
  data: Stats["count"];
  changePercent: Stats["changePercent"];
}

export const StatsGrid = ({ data, changePercent }: StatsGridProps) => {
  const stats = [
    {
      id: 1,
      label: "Revenue",
      value: data.revenue.total,
      lastMonth: data.revenue.lastMonth,
      thisMonth: data.revenue.thisMonth,
      change: changePercent.revenue,
      icon: IndianRupeeIcon,
      color: "bg-blue-50 text-blue-700",
      iconColor: "text-blue-500",
    },
    {
      id: 2,
      label: "Products",
      value: data.product.total,
      lastMonth: data.product.lastMonth,
      thisMonth: data.product.thisMonth,
      change: changePercent.product,
      icon: Package,
      color: "bg-purple-50 text-purple-700",
      iconColor: "text-purple-500",
    },
    {
      id: 3,
      label: "Users",
      value: data.user.total,
      lastMonth: data.user.lastMonth,
      thisMonth: data.user.thisMonth,
      change: changePercent.user,
      icon: Users,
      color: "bg-green-50 text-green-700",
      iconColor: "text-green-500",
    },
    {
      id: 4,
      label: "Orders",
      value: data.order.total,
      lastMonth: data.order.lastMonth,
      thisMonth: data.order.thisMonth,
      change: changePercent.order,
      icon: ShoppingCart,
      color: "bg-amber-50 text-amber-700",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const isPositive = stat.change > 0;

        return (
          <Card
            key={stat.id}
            className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                    <CardTitle className="text-base font-medium block lg:hidden xl:block  ">
                      {stat.label}
                    </CardTitle>
                  </div>
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isPositive
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {stat.change}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold  ">
                  {`${
                    stat.label === "Revenue" ? "$" : ""
                  }${stat.value.toLocaleString("en-IN")}`}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs mb-1">Last Month</p>
                    <p className="text-sm font-semibold ">
                      {`${
                        stat.label === "Revenue" ? "$" : ""
                      }${stat.lastMonth.toLocaleString("en-IN")}`}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1">This Month</p>
                    <p className="text-sm font-semibold ">
                      {`${
                        stat.label === "Revenue" ? "$" : ""
                      }${stat.thisMonth.toLocaleString("en-IN")}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
