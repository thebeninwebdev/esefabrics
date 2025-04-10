"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function RadarChartComponent({ users }: { users: any[] }) {
  // Process user data to get monthly counts for the last 6 months
  const { chartData, percentageChange, isTrendingUp } = useMemo(() => {
    if (!users || users.length === 0) {
      return { chartData: [], percentageChange: 0, isTrendingUp: false }
    }

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Create an array for the last 6 months
    const months = []
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12 // Handle wrapping around to previous year
      const year = monthIndex > currentMonth ? currentYear - 1 : currentYear
      months.push({
        monthIndex,
        year,
        name: new Date(year, monthIndex, 1).toLocaleString("default", { month: "short" }),
      })
    }

    // Count users for each month
    const monthlyCounts = months.map(({ monthIndex, year, name }) => {
      const count = users.filter((user) => {
        const createdDate = new Date(user.created_at)
        return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year
      }).length

      return {
        month: name,
        users: count,
      }
    })

    // Calculate percentage change from previous month to current month
    const currentMonthCount = monthlyCounts[monthlyCounts.length - 1].users
    const previousMonthCount = monthlyCounts[monthlyCounts.length - 2].users

    let percentageChange = 0
    let isTrendingUp = false

    if (previousMonthCount > 0) {
      percentageChange = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
      isTrendingUp = percentageChange >= 0
    } else if (currentMonthCount > 0) {
      // If previous month was 0 and current month has users, it's trending up by 100%
      percentageChange = 100
      isTrendingUp = true
    }

    return {
      chartData: monthlyCounts,
      percentageChange: Math.abs(percentageChange).toFixed(1),
      isTrendingUp,
    }
  }, [users])

  // Get date range for footer
  const dateRange = useMemo(() => {
    if (chartData.length < 2) return "No data available"

    const firstMonth = chartData[0].month
    const lastMonth = chartData[chartData.length - 1].month
    const currentYear = new Date().getFullYear()

    return `${firstMonth} - ${lastMonth} ${currentYear}`
  }, [chartData])

  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-4">
        <CardTitle>New Users</CardTitle>
        <CardDescription>User growth over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <PolarAngleAxis dataKey="month" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
              <PolarGrid stroke="hsl(var(--border))" />
              <Radar
                name="Users"
                dataKey="users"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {isTrendingUp ? (
            <>
              <span className="text-green-600">Trending up by {percentageChange}% this month</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              <span className="text-red-600">Trending down by {percentageChange}% this month</span>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">{dateRange}</div>
      </CardFooter>
    </Card>
  )
}
