"use client"

import * as React from "react"
import {useMemo} from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useAppContext } from "@/context"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
    visitors: {
      label: "Visitors",
    },
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
  } satisfies ChartConfig;

export function DonutComponent() {
    const {visitors} = useAppContext()

  const chartData = useMemo(() => {
    const browsersCount: Record<string, number> = {
      chrome: 0,
      safari: 0,
      firefox: 0,
      edge: 0,
      other: 0,
    };

    visitors.forEach((visitor:any) => {
      const browser = visitor.browser?.toLowerCase() || "other";
      if (browsersCount.hasOwnProperty(browser)) {
        browsersCount[browser]++;
      } else {
        browsersCount["other"]++;
      }
    });

    return [
      { browser: "chrome", visitors: browsersCount.chrome, fill: chartConfig.chrome.color },
      { browser: "safari", visitors: browsersCount.safari, fill: chartConfig.safari.color },
      { browser: "firefox", visitors: browsersCount.firefox, fill: chartConfig.firefox.color },
      { browser: "edge", visitors: browsersCount.edge, fill: chartConfig.edge.color },
      { browser: "other", visitors: browsersCount.other, fill: chartConfig.other.color },
    ];
  }, [visitors]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Visitors browsers</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                          {visitors?.length?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total visitors for since site production.
        </div>
      </CardFooter>
    </Card>
  )
}
