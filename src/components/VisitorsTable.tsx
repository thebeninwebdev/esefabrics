"use client"

import { useState, useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, TrendingUp, TrendingDown } from "lucide-react"

interface Visitor {
  _id: string
  ip: string
  country: string
  browser: string
  os: string
  referrer: string
  createdAt: string | Date
  __v: number
}

interface VisitorChartProps {
  visitors: Visitor[]
}

type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y"

export function VisitorChart({ visitors }: VisitorChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d")

  // Process visitor data based on selected time range
  const { chartData, totalVisitors, percentageChange, isTrendingUp } = useMemo(() => {
    if (!visitors || visitors.length === 0) {
      return { chartData: [], totalVisitors: 0, percentageChange: 0, isTrendingUp: false }
    }

    // Convert all createdAt strings to Date objects
    const processedVisitors = visitors.map((visitor) => ({
      ...visitor,
      createdAt: new Date(visitor.createdAt),
    }))

    // Sort visitors by date
    processedVisitors.sort((a, b) => (a.createdAt as Date).getTime() - (b.createdAt as Date).getTime())

    const now = new Date()
    let startDate: Date
    let format: "hour" | "day" | "week" | "month" = "day"
    let dataPoints = 7 // Default number of data points

    // Set start date and format based on time range
    switch (timeRange) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        format = "hour"
        dataPoints = 24
        break
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        format = "day"
        dataPoints = 7
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        format = "day"
        dataPoints = 30
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        format = "week"
        dataPoints = 13 // ~13 weeks in 90 days
        break
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        format = "month"
        dataPoints = 12
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Filter visitors within the selected time range
    const filteredVisitors = processedVisitors.filter(
      (visitor) => (visitor.createdAt as Date) >= startDate && (visitor.createdAt as Date) <= now,
    )

    // Generate time intervals
    const intervals: { date: string | number | Date, label: string}[] = []
    for (let i = 0; i < dataPoints; i++) {
      let date: Date
      let label: string

      switch (format) {
        case "hour":
          date = new Date(startDate.getTime() + i * 60 * 60 * 1000)
          label = date.getHours().toString().padStart(2, "0") + ":00"
          break
        case "day":
          date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
          label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          break
        case "week":
          date = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000)
          label = `Week ${i + 1}`
          break
        case "month":
          date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
          label = date.toLocaleDateString("en-US", { month: "short" })
          break
      }

      intervals.push({ date, label })
    }

    // Count visitors for each interval
    const chartData = intervals.map((interval, index) => {
      let endDate: Date

      if (index === intervals.length - 1) {
        endDate = now
      } else {
        endDate = new Date(intervals[index + 1].date)
      }

      const count = filteredVisitors.filter(
        (visitor) => (visitor.createdAt as Date) >= interval.date && (visitor.createdAt as Date) < endDate,
      ).length

      return {
        name: interval.label,
        visitors: count,
      }
    })

    // Calculate total visitors
    const totalVisitors = filteredVisitors.length

    // Calculate percentage change
    let percentageChange = 0
    let isTrendingUp = false

    if (format === "day" && chartData.length >= 2) {
      const currentPeriodVisitors = chartData[chartData.length - 1].visitors
      const previousPeriodVisitors = chartData[chartData.length - 2].visitors

      if (previousPeriodVisitors > 0) {
        percentageChange = ((currentPeriodVisitors - previousPeriodVisitors) / previousPeriodVisitors) * 100
        isTrendingUp = percentageChange >= 0
      } else if (currentPeriodVisitors > 0) {
        percentageChange = 100
        isTrendingUp = true
      }
    }

    return {
      chartData,
      totalVisitors,
      percentageChange: Math.abs(percentageChange).toFixed(1),
      isTrendingUp,
    }
  }, [visitors, timeRange])

  // Get time range label for display
  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case "24h":
        return "Last 24 Hours"
      case "7d":
        return "Last 7 Days"
      case "30d":
        return "Last 30 Days"
      case "90d":
        return "Last 90 Days"
      case "1y":
        return "Last Year"
      default:
        return "Last 7 Days"
    }
  }, [timeRange])

  return (
    <Card className="h-full dark:bg-black">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Visitor Traffic</CardTitle>
          <CardDescription>
            {totalVisitors} visitors in the {timeRangeLabel.toLowerCase()}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <SelectTrigger className="w-[110px] bg-transparent">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={30} />
              <Tooltip
                formatter={(value) => [`${value} visitors`, "Visitors"]}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total visitors: {totalVisitors}</span>
          </div>
          {percentageChange && (
            <div className="flex items-center gap-1 text-sm">
              {isTrendingUp ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{percentageChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">-{percentageChange}%</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
