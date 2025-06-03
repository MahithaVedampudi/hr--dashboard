"use client"

import { useState, useEffect } from "react"
import type { Employee } from "@/lib/types"
import { fetchEmployees, removeEmployee } from "@/lib/api"
import { EmployeeCard } from "@/components/employee-card"
import { SearchFilters } from "@/components/search-filters"
import { useSearch } from "@/hooks/use-search"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { UserPlus, RefreshCw, Trash2 } from "lucide-react"
import { AddEmployeeModal } from "@/components/add-employee-modal"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const { toast } = useToast()

  const {
    searchTerm,
    setSearchTerm,
    selectedDepartments,
    setSelectedDepartments,
    selectedRatings,
    setSelectedRatings,
    filteredEmployees,
  } = useSearch(employees)

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const data = await fetchEmployees()
      setEmployees(data)
      setError(null)
    } catch (err) {
      setError("Failed to load employees")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadEmployees()
    setRefreshing(false)
  }

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee)
    setConfirmDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return

    setIsDeleting(true)
    try {
      const success = await removeEmployee(employeeToDelete.id)
      if (success) {
        setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id))
        const employeeName = employeeToDelete.firstName + " " + employeeToDelete.lastName
        toast({
          title: "Employee removed",
          description: employeeName + " has been removed.",
        })
      } else {
        throw new Error("Failed to remove employee")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setConfirmDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }

  const availableDepartments = Array.from(new Set(employees.map((emp) => emp.department))).sort()

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={handleRefresh} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  const confirmDescription = employeeToDelete
    ? "Are you sure you want to remove " +
      employeeToDelete.firstName +
      " " +
      employeeToDelete.lastName +
      "? This action cannot be undone."
    : "Are you sure you want to remove this employee? This action cannot be undone."

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
          <p className="text-muted-foreground">Manage and track employee performance across your organization</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={refreshing ? "h-4 w-4 mr-2 animate-spin" : "h-4 w-4 mr-2"} />
            Refresh
          </Button>

          {isAdmin && (
            <Button onClick={() => setAddModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDepartments={selectedDepartments}
        setSelectedDepartments={setSelectedDepartments}
        selectedRatings={selectedRatings}
        setSelectedRatings={setSelectedRatings}
        availableDepartments={availableDepartments}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="relative group">
                <EmployeeCard employee={employee} />
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleDeleteClick(employee)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No employees found matching your criteria.</p>
            </div>
          )}
        </>
      )}

      <AddEmployeeModal open={addModalOpen} onOpenChange={setAddModalOpen} onEmployeeAdded={loadEmployees} />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Remove Employee"
        description={confirmDescription}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}
