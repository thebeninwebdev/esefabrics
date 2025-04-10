"use client"
import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react"
import { useAppContext } from "@/context"
import { useLoading } from "@/context/LoadingContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

interface Product {
  productId: string
  quantity: number
  variant?: string
  _id: string
}

interface ShippingAddress {
  fullName: string
  address: string
}

interface Order {
  _id: string
  userId: string
  products: Product[]
  totalAmount: number
  status: string
  shippingAddress: ShippingAddress
  orderNote?: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface OrdersTableProps {
  orders: Order[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const { products, fetchAllOrders } = useAppContext()
  const { setLoading } = useLoading()

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Use useMemo instead of useEffect + state to prevent infinite loops
  const filteredOrders = useMemo(() => {
    let result = orders?.length > 0 ? orders : []

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          // Search by order ID
          order._id.toLowerCase().includes(query) ||
          // Search by customer name
          (order.shippingAddress?.fullName && order.shippingAddress.fullName.toLowerCase().includes(query)),
      )
    }

    return result
  }, [orders, statusFilter, searchQuery])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const displayOrders = filteredOrders.slice(startIndex, endIndex)

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Pagination controls
  const goToFirstPage = () => setCurrentPage(1)
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToLastPage = () => setCurrentPage(totalPages)

  async function updateStatus(order: any): Promise<void> {
    try {
      setLoading(true)
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: order }),
      })

      if (!response.ok) {
        toast.error(`Failed to update order: ${response.statusText}`)
      }
      toast.success("Order updated successfully!")
      fetchAllOrders()
    } catch (error) {
      toast.error("Error updating order")
    } finally {
      setLoading(false)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all")
    setSearchQuery("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Order Details</CardTitle>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or order ID"
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear filters button - only show when filters are active */}
            {(statusFilter !== "all" || searchQuery) && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="whitespace-nowrap">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-nowrap">Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.length > 0 ? (
              displayOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id.substring(order._id.length - 8)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {order.products.map((product, index) => (
                        <Badge key={product._id} variant="outline" className="px-2 py-1 text-nowrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/product-page/${product?.productId}`}>
                                  {products.find((item: any) => item._id === product.productId)?.name?.slice(0, 20) +
                                    "..." || "Unavailable"}
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {products.find((item: any) => item._id === product.productId)?.name || "Unavailable"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {product.variant && <span className="ml-1">({product.variant})</span>}
                          <span className="ml-1">x{product.quantity}</span>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-nowrap">{order?.shippingAddress?.fullName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-nowrap">{order?.shippingAddress?.address}</span>
                  </TableCell>
                  <TableCell>₦{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="text-nowrap">{formatDate(order.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    {order?.status === "cancelled" || order?.status === "delivered" ? (
                      <div
                        className={`
                ${order?.status === "delivered" ? "bg-primary" : "bg-destructive"} w-full flex justify-center text-white py-2 rounded-md`}
                      >
                        {order.status}
                      </div>
                    ) : (
                      <Select onValueChange={(value) => updateStatus({ ...order, status: value })}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder={order?.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Change</SelectLabel>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 py-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredOrders.length > 0 ? startIndex + 1 : 0}</span> to{" "}
              <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> of{" "}
              <span className="font-medium">{filteredOrders.length}</span> orders
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Rows per page</p>
              <Select
                value={perPage.toString()}
                onValueChange={(value) => {
                  setPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={perPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1 || filteredOrders.length === 0}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || filteredOrders.length === 0}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{filteredOrders.length > 0 ? currentPage : 0}</span>
              <span className="text-sm text-muted-foreground">of</span>
              <span className="text-sm font-medium">{totalPages || 0}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || filteredOrders.length === 0}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages || filteredOrders.length === 0}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
