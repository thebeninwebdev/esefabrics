"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMediaQuery } from "@/hooks/use-media-query"

// Define the visitor type based on the provided example
type Visitor = {
  _id: { $oid: string }
  ip: string
  country: string
  browser: string
  os: string
  referrer: string
  createdAt: { $date: { $numberLong: string } }
  __v: { $numberInt: string }
}

// Helper function to count occurrences and sort by count
function processData(visitors: Visitor[], key: keyof Visitor, limit: number) {
  const counts: Record<string, number> = {}

  visitors.forEach((visitor) => {
    const value = visitor[key] as string
    counts[value] = (counts[value] || 0) + 1
  })

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function VisitorAnalytics({ visitors }: { visitors: Visitor[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallMobile = useMediaQuery("(max-width: 400px)")

  const [countryData, setCountryData] = useState<{ name: string; count: number }[]>([])
  const [browserData, setBrowserData] = useState<{ name: string; count: number }[]>([])
  const [osData, setOsData] = useState<{ name: string; count: number }[]>([])

  useEffect(() => {
    if (visitors && visitors.length > 0) {
      // Show fewer items on small screens
      const limit = isSmallMobile ? 3 : 5
      setCountryData(processData(visitors, "country", limit))
      setBrowserData(processData(visitors, "browser", limit))
      setOsData(processData(visitors, "os", limit))
    }
  }, [visitors, isSmallMobile])

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-2))",
    },
  }

  // Adjust chart dimensions and properties based on screen size
  const chartHeight = isMobile ? 250 : 350
  const leftMargin = isMobile ? 0 : 0
  const rightMargin = isMobile ? 30 : 40
  const barSize = isMobile ? 25 : 25
  const fontSize = isMobile ? 10 : 12
  const labelOffset = isMobile ? 3 : 5
  const yAxisWidth = isMobile ? 55 : 65
  const maxLabelLength = isMobile ? 6 : 8

  const renderChart = (data: { name: string; count: number }[], title: string) => (
    <Card className="w-full">
      <CardHeader className="pb-2 border-b-2 border">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">
          {title === "Top Countries"
            ? "Visitor distribution by country"
            : title === "Top Browsers"
              ? "Visitor distribution by browser"
              : "Visitor distribution by OS"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"
                margin={{
                  left: leftMargin,
                  right: rightMargin,
                }}
                barSize={barSize}
                barGap={2}
                maxBarSize={25}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={yAxisWidth}
                  fontSize={fontSize}
                  tickFormatter={(value) =>
                    value.length > maxLabelLength ? `${value.substring(0, maxLabelLength)}...` : value
                  }
                  reversed={true}
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4}>
                  <LabelList
                    dataKey="count"
                    position="right"
                    offset={labelOffset}
                    className="fill-foreground"
                    fontSize={fontSize}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {renderChart(countryData, "Top Countries")}
      {renderChart(browserData, "Top Browsers")}
      {renderChart(osData, "Top Operating Systems")}
    </div>
  )
}