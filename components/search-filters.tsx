"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X } from "lucide-react"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDepartments: string[]
  setSelectedDepartments: (departments: string[]) => void
  selectedRatings: number[]
  setSelectedRatings: (ratings: number[]) => void
  availableDepartments: string[]
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedDepartments,
  setSelectedDepartments,
  selectedRatings,
  setSelectedRatings,
  availableDepartments,
}: SearchFiltersProps) {
  const ratings = [1, 2, 3, 4, 5]

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, department])
    } else {
      setSelectedDepartments(selectedDepartments.filter((d) => d !== department))
    }
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating])
    } else {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating))
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDepartments([])
    setSelectedRatings([])
  }

  const hasActiveFilters = searchTerm || selectedDepartments.length > 0 || selectedRatings.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Departments
                {selectedDepartments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedDepartments.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h4 className="font-medium">Filter by Department</h4>
                {availableDepartments.map((department) => (
                  <div key={department} className="flex items-center space-x-2">
                    <Checkbox
                      id={department}
                      checked={selectedDepartments.includes(department)}
                      onCheckedChange={(checked) => handleDepartmentChange(department, checked as boolean)}
                    />
                    <label htmlFor={department} className="text-sm">
                      {department}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Ratings
                {selectedRatings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedRatings.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <h4 className="font-medium">Filter by Rating</h4>
                {ratings.map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                    />
                    <label htmlFor={`rating-${rating}`} className="text-sm">
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedDepartments.map((dept) => (
            <Badge
              key={dept}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleDepartmentChange(dept, false)}
            >
              {dept} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {selectedRatings.map((rating) => (
            <Badge
              key={rating}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleRatingChange(rating, false)}
            >
              {rating} Star{rating !== 1 ? "s" : ""} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
