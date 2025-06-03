"use client"

import type { Employee } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Eye, Bookmark, TrendingUp } from "lucide-react"
import { useBookmarks } from "@/lib/bookmark-context"
import Link from "next/link"

interface EmployeeCardProps {
  employee: Employee
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()
  const bookmarked = isBookmarked(employee.id)

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(employee.id)
    } else {
      addBookmark(employee)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={employee.image || "/placeholder.svg"}
              alt={`${employee.firstName} ${employee.lastName}`}
            />
            <AvatarFallback>
              {employee.firstName[0]}
              {employee.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
            <p className="text-sm text-muted-foreground">Age: {employee.age}</p>

            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{employee.department}</Badge>
            </div>

            <div className="flex items-center space-x-1 mt-2">
              {renderStars(employee.rating)}
              <span className="text-sm text-muted-foreground ml-2">({employee.rating}/5)</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-6 pt-0">
        <div className="flex space-x-2">
          <Link href={`/employee/${employee.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>

          <Button variant={bookmarked ? "default" : "outline"} size="sm" onClick={handleBookmark}>
            <Bookmark className={`h-4 w-4 mr-1 ${bookmarked ? "fill-current" : ""}`} />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>

        <Button variant="outline" size="sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          Promote
        </Button>
      </CardFooter>
    </Card>
  )
}
