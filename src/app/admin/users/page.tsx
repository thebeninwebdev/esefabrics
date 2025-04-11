'use client'

import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppContext } from "@/context"
import { useLoading } from "@/context/LoadingContext"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
  const {allUsers, fetchAllUsers} = useAppContext()
  const {setLoading} = useLoading()

  useEffect(() => {
    fetchAllUsers()
  },[])

  useEffect(() => {
    
    
    if(allUsers?.length > 0){
        setLoading(false)
    }else{
        setLoading(true)
    }
  },[allUsers])

    // Filter users based on search term
    const filteredUsers = allUsers.filter((user:any) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower)
        )
      })

  return (
<div className="container py-10 mx-auto">
      <Card className="w-full">
        <CardHeader className="flex flex-col space-y-4">
          <CardTitle>Users</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or username..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user:any) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-nowrap">{user.username}</TableCell>
                    <TableCell className="text-nowrap">{user.email}</TableCell>
                    <TableCell className="text-nowrap">{user.phone}</TableCell>
                    <TableCell className="text-nowrap">{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-nowrap">{formatDate(user.last_login)}</TableCell>
                    <TableCell>
                      {user.verified ? (
                        <Badge variant="default" className="bg-green-500">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Unverified</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
