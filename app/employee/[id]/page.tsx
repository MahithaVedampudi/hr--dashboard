"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Employee } from "@/lib/types"
import { fetchEmployee } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin, Phone, Mail, Bookmark, TrendingUp } from "lucide-react"
import { useBookmarks } from "@/lib/bookmark-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function EmployeeDetailPage() {
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true)
        const data = await fetchEmployee(id)
        setEmployee(data)
      } catch (err) {
        setError("Failed to load employee details")
      } finally {
        setLoading(false)
      }
    }

    loadEmployee()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-start space-x-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Employee not found"}</p>
      </div>
    )
  }

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
      <Star key={i} className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500"
    if (rating >= 3) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
        <Avatar className="h-32 w-32">
          <AvatarImage src={employee.image || "/placeholder.svg"} alt={`${employee.firstName} ${employee.lastName}`} />
          <AvatarFallback className="text-2xl">
            {employee.firstName[0]}
            {employee.lastName[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">
              {employee.firstName} {employee.lastName}
            </h1>
            <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {employee.department}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Age: {employee.age}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {renderStars(employee.rating)}
            <span className="text-lg font-semibold">({employee.rating}/5)</span>
            <Badge className={`${getRatingColor(employee.rating)} text-white`}>
              {employee.rating >= 4 ? "Excellent" : employee.rating >= 3 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>

          <div className="flex items-center space-x-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {employee.address.address}, {employee.address.city}, {employee.address.state}
            </span>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleBookmark} variant={bookmarked ? "default" : "outline"}>
              <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Promote
            </Button>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{employee.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.performanceHistory.map((record) => (
                  <div key={record.id} className="border-l-4 border-primary pl-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{record.period}</h4>
                      <div className="flex items-center space-x-1">{renderStars(record.rating)}</div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Goals:</h5>
                        <ul className="text-sm list-disc list-inside">
                          {record.goals.map((goal, i) => (
                            <li key={i}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Achievements:</h5>
                        <ul className="text-sm list-disc list-inside">
                          {record.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employee.projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge
                      variant={
                        project.status === "completed"
                          ? "default"
                          : project.status === "active"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="space-y-4">
            {employee.feedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{feedback.from}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(feedback.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">{renderStars(feedback.rating)}</div>
                  </div>
                  <p className="text-muted-foreground">{feedback.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
