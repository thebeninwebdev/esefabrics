"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { DonutComponent } from "@/components/charts/Donut"
import { BarchatComponent } from "@/components/charts/Barchat"
import OrdersTable from "@/components/OrderTable"
import { RadarChartComponent } from "@/components/RadarChart"

export default function DashboardPage() {
  const { fetchAllOrders, allOrders, fetchAllVisitors, visitors, } = useAppContext()
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    fetchAllOrders()
    fetchAllUsers()
    fetchAllVisitors()
  }, [])

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        toast.error("Failed to fetch orders")
      }

      const data = await res.json()

      setAllUsers(data)

      return data
    } catch (error) {
      toast.error("fetchCart error")
      console.log("fetchCart error:", error)
      return null
    }
  }

  function calculateMonthlySales(allOrders: any[]): number {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalSales = 0

    const validStatuses = ["paid", "shipped", "delivered"]

    allOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear &&
        validStatuses.includes(order.status)
      ) {
        totalSales += order.totalAmount
      }
    })

    return totalSales
  }

  // Get the current year and month
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  // ✅ Memoize userData so it only recalculates when allOrders changes
  const orderData = [
    {
      header: "New Customers",
      value:
        allUsers?.length > 0
          ? allUsers.filter((order: any) => {
              const createdAtDate = new Date(order.createdAt)
              return createdAtDate.getFullYear() === currentYear && createdAtDate.getMonth() === currentMonth
            }).length
          : 0,
      description: "Total Users this month",
    },
    {
      header: "Total Sales",
      value: allOrders?.length > 0 ? calculateMonthlySales(allOrders) : 0,
      description: "New Sales this month",
    },
    {
      header: "Total Orders",
      value:
        allOrders?.length > 0
          ? allOrders.filter((order: any) => {
              const createdAtDate = new Date(order.createdAt)
              return (
                createdAtDate.getFullYear() === currentYear &&
                createdAtDate.getMonth() === currentMonth &&
                (order.status === "delivered" || order.status === "paid" || order.status === "shipped")
              )
            }).length
          : 0,
      description: "Fulfilled Orders this month",
    },
    {
      header: "New Visits",
      value:
        visitors?.length > 0
          ? visitors.filter((visitor: any) => {
              const createdAtDate = new Date(visitor.createdAt)
              return createdAtDate.getFullYear() === currentYear && createdAtDate.getMonth() === currentMonth
            }).length
          : 0,
      description: "Cancelled Orders this month",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="mb-8">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store's performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {orderData &&
            orderData.map((order, idx: number) => (
              <Card key={idx} className="overflow-hidden">
                <CardContent className="p-6 bg-accent-dark rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <p className="text-text-dark text-sm font-medium">{order?.header}</p>
                      <h2 className="text-2xl font-bold text-text-dark">
                        {order?.header === "Total Sales" ? "₦ " + order?.value.toLocaleString() : order?.value}
                      </h2>
                      <p className="text-xs text-text-dark">{order?.description}</p>
                    </div>
                    <div className="text-gray-400">—</div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-2 mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Visual representation of your store data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Each chart is in its own responsive container */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Customer Distribution</h3>
            <div className="h-[400px] w-full">{visitors && <DonutComponent />}</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Monthly Sales</h3>
            <div className="h-[400px] w-full">{allOrders && <BarchatComponent orders={allOrders}/>}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-20">
      {allOrders && 
      <div className="lg:col-span-3 lg:row-span-2">
        <OrdersTable orders={allOrders} />
      </div>
      }
      {allUsers && 
      <div className="lg:col-span-1">
        <RadarChartComponent users={allUsers} />
      </div>
  }
</div>


    </div>
  )
}
