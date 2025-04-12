"use client"

import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context";
import OrdersTable from "@/components/OrderTable";

export default function OrdersPage() {
  const {orders} = useAppContext();
  return (
    <div className="py-20 px-5 md:px-10 w-full max-w-7xl mx-auto">
    {orders?.length > 0 && <OrdersTable orders={orders}/>}
    </div>
  );
}