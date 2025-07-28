"use client";

import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

type PieChartData = {
  name: string;
  value: number;
  color?: string;
};

type PieChartCardProps = {
  title: string;
  description?: string;
  data: PieChartData[];
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
  trend?: number;
  footerNote?: string;
  innerRadius?: number;
  strokeWidth?: number;
  legend?: boolean;
};

const renderActiveShape = (props: PieSectorDataItem) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius = 0,
    startAngle,
    endAngle,
    fill,
  } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

// Simple debounce function
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PieChartCard = ({
  title,
  description,
  data,
  config,
  dataKey,
  nameKey,
  trend = 0,
  // footerNote,
  legend = true,
  innerRadius = 60,
  strokeWidth = 5,
}: PieChartCardProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  // Use debounce to prevent flickering
  const activeIndex = useDebounce(hoverIndex, 100);
  const processedData = data.map((item) => ({
    ...item,
    fill: item.color || config[item.name]?.color || "#8884d8",
  }));

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Handlers with built-in threshold to prevent accidental triggers
  let lastEnterTime = 0;

  const onPieEnter = (_: any, index: number) => {
    const now = Date.now();
    // Only update if enough time has passed since last change
    if (now - lastEnterTime > 80) {
      setHoverIndex(index);
      lastEnterTime = now;
    }
  };

  const onPieLeave = () => {
    setHoverIndex(null);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square ">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  label={config[dataKey]?.label || "Value"}
                />
              }
            />
            <Pie
              data={processedData}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              strokeWidth={strokeWidth}
              activeIndex={activeIndex !== null ? activeIndex : 0}
              minAngle={5} // Increased minimum angle to prevent tiny slices
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              // Add increased hit radius for better interaction
              isAnimationActive={false} // Disabling animation can help with flickering
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    // If a segment is hovered, show its percentage
                    if (activeIndex !== null) {
                      const hoveredItem = processedData[activeIndex];
                      const percentage = (
                        (hoveredItem.value / totalValue) *
                        100
                      ).toFixed(1);

                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {percentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {hoveredItem.name}
                          </tspan>
                        </text>
                      );
                    }

                    // Default view: show total visitors
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {title}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>

            {legend && (
              <ChartLegend
                content={<ChartLegendContent nameKey={nameKey} />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                // formatter={(value: number) => `${value}%`}
                formatter={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              />
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;

// "use client";

// import { Label, Pie, PieChart, Sector } from "recharts";
// import { PieSectorDataItem } from "recharts/types/polar/Pie";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { useState } from "react";

// type PieChartData = {
//   name: string;
//   value: number;
//   color?: string;
// };

// type PieChartCardProps = {
//   title: string;
//   description?: string;
//   data: PieChartData[];
//   config: ChartConfig;
//   dataKey: string;
//   nameKey: string;
//   trend?: number;
//   footerNote?: string;
//   innerRadius?: number;
//   strokeWidth?: number;
//   legend?: boolean;
// };

// const renderActiveShape = (props: PieSectorDataItem) => {
//   const {
//     cx,
//     cy,
//     innerRadius,
//     outerRadius = 0,
//     startAngle,
//     endAngle,
//     fill,
//   } = props;
//   return (
//     <Sector
//       cx={cx}
//       cy={cy}
//       innerRadius={innerRadius}
//       outerRadius={outerRadius + 10}
//       startAngle={startAngle}
//       endAngle={endAngle}
//       fill={fill}
//     />
//   );
// };

// const PieChartCard = ({
//   title,
//   description,
//   data,
//   config,
//   dataKey,
//   nameKey,
//   trend = 0,
//   // footerNote,
//   legend = true,
//   innerRadius = 60,
//   strokeWidth = 5,
// }: PieChartCardProps) => {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   const processedData = data.map((item) => ({
//     ...item,
//     fill: item.color || config[item.name]?.color || "#8884d8",
//   }));

//   const totalValue = data.reduce((sum, item) => sum + item.value, 0);
//   const minValue = Math.min(
//     ...data.map((item) => item.value).filter((v) => v > 0)
//   );
//   const minAngle = Math.max(5, (minValue / totalValue) * 360); // Ensure proportional representation

//   const onPieEnter = (_: any, index: number) => {
//     setActiveIndex(index);
//   };

//   const onPieLeave = () => {
//     setActiveIndex(null);
//   };

//   return (
//     <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>{title}</CardTitle>
//         {description && <CardDescription>{description}</CardDescription>}
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer config={config} className="mx-auto aspect-square ">
//           <PieChart>
//             <ChartTooltip cursor={false} content={customTooltipContent} />
//             <Pie
//               data={processedData}
//               dataKey={dataKey}
//               nameKey={nameKey}
//               innerRadius={innerRadius}
//               strokeWidth={strokeWidth}
//               activeIndex={activeIndex !== null ? activeIndex : 0}
//               minAngle={2}
//               activeShape={renderActiveShape}
//               onMouseEnter={onPieEnter}
//               onMouseLeave={onPieLeave}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     // If a segment is hovered, show its percentage
//                     if (activeIndex !== null) {
//                       const hoveredItem = processedData[activeIndex];
//                       const percentage = (
//                         (hoveredItem.value / totalValue) *
//                         100
//                       ).toFixed(1);

//                       return (
//                         <text
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           textAnchor="middle"
//                           dominantBaseline="middle"
//                         >
//                           <tspan
//                             x={viewBox.cx}
//                             y={viewBox.cy}
//                             className="fill-foreground text-3xl font-bold"
//                           >
//                             {percentage}%
//                           </tspan>
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy || 0) + 24}
//                             className="fill-muted-foreground"
//                           >
//                             {hoveredItem.name}
//                           </tspan>
//                         </text>
//                       );
//                     }

//                     // Default view: show total visitors
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-3xl font-bold"
//                         >
//                           {totalValue}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                           Visitors
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </Pie>
//             {legend && (
//               <ChartLegend
//                 content={<ChartLegendContent nameKey={nameKey} />}
//                 className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
//                 formatter={({ name, percent }) =>
//                   `${name} (${(percent * 100).toFixed(0)}%)`
//                 }
//               />
//             )}
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// };

// export default PieChartCard;
