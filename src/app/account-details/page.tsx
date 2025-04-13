"use client"

import { useEffect, useState } from "react"
import { User, Mail, Phone, Calendar, Clock, Shield, CheckCircle, Edit2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context"

export default function AccountPage() {
  // In a real app, you would fetch this data from your API
  const router = useRouter()
  const { fetchUser, user } = useAppContext()

  useEffect(() => {
    fetchUser()
  },[])

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (phone?.startsWith("234")) {
      return `+${phone?.slice(0, 3)} ${phone?.slice(3, 6)} ${phone.slice(6, 9)} ${phone?.slice(9)}`
    }
    return phone
  }


  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}

  // Calculate account age
const calculateAccountAge = (createdAt: string) => {
    const now = new Date()
    const createDate = new Date(createdAt)
    const diffTime = Math.abs(now.getTime() - (createDate instanceof Date ? createDate.getTime() : now.getTime()))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? "s" : ""}`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      return `${years} year${years > 1 ? "s" : ""}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
    {user?.name &&<div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Account Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center pb-2">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg" alt={user?.name} />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center">{user?.name}</CardTitle>
            <CardDescription className="text-center">@{user?.username}</CardDescription>
            {user?.verified && (
              <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified Account
              </Badge>
            )}
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">Member for {calculateAccountAge(user?.created_at)}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" size="sm" onClick={() => {
              toast.success("This is a test account and you dont have the necessary permissions to perform this action")
            }}>
              <Edit2 className="h-4 w-4 mr-2"/> Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Account Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Personal Details</TabsTrigger>
                <TabsTrigger value="security">Security & Login</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" /> Full Name
                    </p>
                    <p>{user?.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" /> Username
                    </p>
                    <p>@{user?.username}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" /> Email Address
                    </p>
                    <p>{user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" /> Phone Number
                    </p>
                    <p>{formatPhoneNumber(user?.phone)}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" /> Account Created
                    </p>
                    <p>{formatDate(user?.created_at)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2" /> Account Status
                    </p>
                    <p className="flex items-center">
                      {user?.verified ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span> Active
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span> Pending Verification
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" /> Last Login
                    </p>
                    <p>{formatDate(user?.last_login)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2" /> Account Role
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user?.roles &&
                        <Badge variant="secondary">
                          {user?.roles.includes(process.env.USER) ? "Customer" : "Admin"}
                        </Badge>
                      }
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Password & Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your password and security settings to keep your account secure.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('auth/login?reset=true')}>
                      Change Password
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.error("This is a test account and you dont have the necessary permissions to perform this action")}>
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => toast.error("This is a test account and you dont have the necessary permissions to perform this action")}>
              Download Personal Data
            </Button>
            <Button variant="destructive" size="sm" onClick={() => toast.success("Your request for account deletion has been submitted, your account will be deleted within 30 days of inactivity")}>
              Delete Account
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent account activity and login history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border"></div>
            <ul className="space-y-4 ml-6">
              <li className="relative">
                <span className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-primary"></span>
                <div className="space-y-1">
                  <p className="font-medium">Logged in successfully</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user?.last_login)}</p>
                </div>
              </li>
              <li className="relative">
                <span className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-muted"></span>
                <div className="space-y-1">
                  <p className="font-medium">Account created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user?.created_at)}</p>
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>}</>
  )
}
