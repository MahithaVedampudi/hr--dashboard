export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  image: string
  department: string
  rating: number
  bio: string
  projects: Project[]
  feedback: Feedback[]
  performanceHistory: PerformanceRecord[]
}

export interface Project {
  id: number
  name: string
  status: "active" | "completed" | "on-hold"
  progress: number
  deadline: string
}

export interface Feedback {
  id: number
  from: string
  message: string
  rating: number
  date: string
}

export interface PerformanceRecord {
  id: number
  period: string
  rating: number
  goals: string[]
  achievements: string[]
}

export interface DepartmentStats {
  department: string
  averageRating: number
  employeeCount: number
}
