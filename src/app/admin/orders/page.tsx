'use client'

import React, { useEffect, useMemo } from 'react'
import { useAppContext } from "@/context"
import { Card, CardContent } from "@/components/ui/card"
import OrdersTable from "@/components/OrderTable"

export default function Page() {
    const { fetchAllOrders, allOrders } = useAppContext()

    useEffect(() => {
        fetchAllOrders()
    }, [])

    // Get the current year and month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // ✅ Memoize orderData so it only recalculates when allOrders changes
    const orderData = useMemo(() => [
        {
            header: "Total Orders",
            value: allOrders?.length > 0 ? allOrders.filter((order: any) => {
                const createdAtDate = new Date(order.createdAt);
                return (
                    createdAtDate.getFullYear() === currentYear &&
                    createdAtDate.getMonth() === currentMonth
                )
            }).length : 0,
            description: "Total Orders this month"
        },
        {
            header: "New Orders",
            value: allOrders?.length > 0 ? allOrders.filter((order: any) => {
                const createdAtDate = new Date(order.createdAt);
                return (
                    createdAtDate.getFullYear() === currentYear &&
                    createdAtDate.getMonth() === currentMonth &&
                    order.status === 'paid'
                )
            }).length : 0,
            description: "New Orders this month"
        },
        {
            header: "Fulfilled Orders",
            value: allOrders?.length > 0 ? allOrders.filter((order: any) => {
                const createdAtDate = new Date(order.createdAt);
                return (
                    createdAtDate.getFullYear() === currentYear &&
                    createdAtDate.getMonth() === currentMonth &&
                    order.status === 'delivered'
                )
            }).length : 0,
            description: "Fulfilled Orders this month"
        },
        {
            header: "Cancelled Orders",
            value: allOrders?.length > 0 ? allOrders.filter((order: any) => {
                const createdAtDate = new Date(order.createdAt);
                return (
                    createdAtDate.getFullYear() === currentYear &&
                    createdAtDate.getMonth() === currentMonth &&
                    order.status === 'cancelled'
                )
            }).length : 0,
            description: "Cancelled Orders this month"
        },
    ], [allOrders, currentYear, currentMonth]); // ✅ Dependency array

    return (
        <div className="py-10">
            <div>
                <div className="space-y-2">
                    <h1 className="text-2xl">Orders List</h1>
                    <p className="text-sm">Here you can find all your orders</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-5">
                    {
                        orderData && orderData.map((order, idx: number) => (
                            <div key={idx}>
                                <Card>
                                    <CardContent className="pt-6 bg-accent-dark rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-2">
                                                <p className=" text-text-dark text-sm">{order?.header}</p>
                                                <h2 className="text-2xl font-bold text-text-dark">{order?.value}</h2>
                                                <p className="text-xs text-text-dark">{order?.description}</p>
                                            </div>
                                            <div className="text-gray-400">—</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    }
                </div>
            </div>
            {allOrders && <div className="container mx-auto py-10">
                <OrdersTable orders={allOrders} />
            </div>}
        </div>
    )
}
