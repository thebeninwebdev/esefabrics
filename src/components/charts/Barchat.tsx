"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, TooltipProps } from "recharts"
import { useAppContext } from "@/context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border bg-white dark:bg-black p-2 shadow-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-foreground">
          <span className="text-muted-foreground">Sales: </span>
          <span className="font-medium">₦{payload[0].value?.toLocaleString()}</span>
        </p>
      </div>
    )
  }

  return null
}

export function BarchatComponent({ orders: propOrders }: { orders?: any[] }) {
  // Use orders from props if provided, otherwise from context
  const { allOrders } = useAppContext()
  const orders = propOrders || allOrders

  // Prepare monthly sales data for the last 6 months
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return []

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Create an array for the last 6 months
    const months = []
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12 // Handle wrapping around to previous year
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
      months.push({
        monthIndex,
        year,
        name: new Date(year, monthIndex, 1).toLocaleString("default", { month: "short" }),
      })
    }

    // Calculate sales for each month
    return months.map(({ monthIndex, year, name }) => {
      const monthlySales = orders.reduce((sum:number, order:any) => {
        const orderDate = new Date(order.createdAt)
        if (
          orderDate.getMonth() === monthIndex &&
          orderDate.getFullYear() === year &&
          (order.status === "paid" || order.status === "shipped" || order.status === "delivered")
        ) {
          return sum + (order.totalAmount || 0)
        }
        return sum
      }, 0)

      return {
        name,
        sales: monthlySales,
      }
    })
  }, [orders])

  // Calculate if sales are trending up
  const isTrendingUp = useMemo(() => {
    if (chartData.length < 2) return true
    const lastMonth = chartData[chartData.length - 1].sales
    const previousMonth = chartData[chartData.length - 2].sales
    return lastMonth >= previousMonth
  }, [chartData])

  // Calculate total sales for the period
  const totalSales = useMemo(() => {
    return chartData.reduce((sum, month) => sum + month.sales, 0)
  }, [chartData])

  // Format currency
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardDescription>Sales for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={8} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
        <div className="flex gap-2 font-medium leading-none">
          {isTrendingUp ? (
            <>
              <span className="text-green-600">Sales trending up</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              <span className="text-red-600">Sales trending down</span>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">Total 6-month sales: {formatCurrency(totalSales)}</div>
      </CardFooter>
    </Card>
  )
}
