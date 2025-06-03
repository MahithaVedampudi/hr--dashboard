import type { Employee, Project, Feedback, PerformanceRecord } from "./types"

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Product",
  "Legal",
  "Support",
]

const projects: Project[] = [
  { id: 1, name: "Website Redesign", status: "active", progress: 75, deadline: "2024-02-15" },
  { id: 2, name: "Mobile App Launch", status: "completed", progress: 100, deadline: "2024-01-30" },
  { id: 3, name: "Database Migration", status: "on-hold", progress: 30, deadline: "2024-03-01" },
  { id: 4, name: "API Integration", status: "active", progress: 60, deadline: "2024-02-28" },
]

const feedbackTemplates: Omit<Feedback, "id">[] = [
  {
    from: "John Manager",
    message: "Excellent work on the recent project. Shows great leadership skills.",
    rating: 5,
    date: "2024-01-15",
  },
  {
    from: "Sarah Director",
    message: "Consistently delivers high-quality work. Great team player.",
    rating: 4,
    date: "2024-01-10",
  },
  { from: "Mike Lead", message: "Good technical skills, could improve communication.", rating: 3, date: "2024-01-05" },
]

const performanceTemplates: Omit<PerformanceRecord, "id">[] = [
  {
    period: "Q4 2023",
    rating: 4,
    goals: ["Complete project X", "Improve team collaboration", "Learn new technology"],
    achievements: ["Delivered project ahead of schedule", "Mentored 2 junior developers"],
  },
  {
    period: "Q3 2023",
    rating: 5,
    goals: ["Lead team initiative", "Reduce bug count by 20%", "Attend conference"],
    achievements: ["Successfully led team of 5", "Reduced bugs by 25%", "Presented at tech conference"],
  },
]

// Store employees in memory for the session
let employeesCache: Employee[] = []

function generateMockData(user: any): Employee {
  const department = departments[Math.floor(Math.random() * departments.length)]
  const rating = Math.floor(Math.random() * 5) + 1

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    age: user.age,
    phone: user.phone,
    address: user.address,
    image: user.image,
    department,
    rating,
    bio: `Experienced ${department.toLowerCase()} professional with ${Math.floor(Math.random() * 10) + 1} years of experience. Passionate about innovation and team collaboration.`,
    projects: projects.slice(0, Math.floor(Math.random() * 3) + 1).map((p) => ({ ...p })),
    feedback: feedbackTemplates.slice(0, Math.floor(Math.random() * 2) + 1).map((f, i) => ({ ...f, id: i + 1 })),
    performanceHistory: performanceTemplates
      .slice(0, Math.floor(Math.random() * 2) + 1)
      .map((p, i) => ({ ...p, id: i + 1 })),
  }
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    // Return cached employees if available
    if (employeesCache.length > 0) {
      return employeesCache
    }

    const response = await fetch("https://dummyjson.com/users?limit=20")
    const data = await response.json()
    employeesCache = data.users.map(generateMockData)
    return employeesCache
  } catch (error) {
    console.error("Failed to fetch employees:", error)
    return []
  }
}

export async function fetchEmployee(id: number): Promise<Employee | null> {
  try {
    // Check cache first
    const cachedEmployee = employeesCache.find((e) => e.id === id)
    if (cachedEmployee) {
      return cachedEmployee
    }

    const response = await fetch(`https://dummyjson.com/users/${id}`)
    const user = await response.json()
    return generateMockData(user)
  } catch (error) {
    console.error("Failed to fetch employee:", error)
    return null
  }
}

export async function addEmployee(employeeData: Partial<Employee>): Promise<Employee> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newEmployee: Employee = {
    id: Math.max(0, ...employeesCache.map((e) => e.id)) + 1,
    firstName: employeeData.firstName || "",
    lastName: employeeData.lastName || "",
    email: employeeData.email || "",
    age: employeeData.age || 25,
    phone: employeeData.phone || "",
    address: employeeData.address || {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    image: employeeData.image || "/placeholder.svg?height=128&width=128",
    department: employeeData.department || departments[0],
    rating: employeeData.rating || 3,
    bio: employeeData.bio || `New employee in the ${employeeData.department || departments[0]} department.`,
    projects: [],
    feedback: [],
    performanceHistory: [],
  }

  employeesCache.push(newEmployee)
  return newEmployee
}

export async function removeEmployee(id: number): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const initialLength = employeesCache.length
  employeesCache = employeesCache.filter((e) => e.id !== id)

  return employeesCache.length < initialLength
}
