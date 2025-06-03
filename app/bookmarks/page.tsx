"use client"

import { useBookmarks } from "@/lib/bookmark-context"
import { EmployeeCard } from "@/components/employee-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookmarkIcon, Users } from "lucide-react"

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks()

  const handleAssignProject = (employeeId: number) => {
    // Mock action - in real app would open a modal or navigate to assignment page
    alert(`Assigning project to employee ${employeeId}`)
  }

  const handlePromote = (employeeId: number) => {
    // Mock action - in real app would open promotion workflow
    alert(`Promoting employee ${employeeId}`)
  }

  if (bookmarks.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bookmarked Employees</h1>
          <p className="text-muted-foreground">Keep track of your favorite employees for quick access</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <BookmarkIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-4">
              Start bookmarking employees from the main dashboard to see them here.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bookmarked Employees</h1>
          <p className="text-muted-foreground">
            {bookmarks.length} employee{bookmarks.length !== 1 ? "s" : ""} bookmarked
          </p>
        </div>

        <div className="flex items-center space-x-2 text-muted-foreground">
          <Users className="h-5 w-5" />
          <span>{bookmarks.length}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => bookmarks.forEach((emp) => handleAssignProject(emp.id))}
            disabled={bookmarks.length === 0}
          >
            Assign Project to All
          </Button>
          <Button
            variant="outline"
            onClick={() => bookmarks.forEach((emp) => handlePromote(emp.id))}
            disabled={bookmarks.length === 0}
          >
            Bulk Promote
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((employee) => (
            <div key={employee.id} className="relative">
              <EmployeeCard employee={employee} />
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeBookmark(employee.id)}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
