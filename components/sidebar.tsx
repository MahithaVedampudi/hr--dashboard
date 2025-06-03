"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, BookmarkIcon, BarChart3, Home, LogOut, Menu, X, Settings, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Bookmarks", href: "/bookmarks", icon: BookmarkIcon },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Don't render sidebar on login page
  if (pathname === "/login") return null

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-md bg-primary/10 p-1">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl">HR Dashboard</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-6 px-4">
            <nav className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-2">Main</h3>
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={pathname === item.href ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start",
                            pathname === item.href && "bg-secondary text-secondary-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-2">Management</h3>
                <div className="space-y-1">
                  <Link href="/users">
                    <Button
                      variant={pathname === "/users" ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        pathname === "/users" && "bg-secondary text-secondary-foreground",
                      )}
                    >
                      <Users className="h-4 w-4 mr-3" />
                      <span>Users</span>
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button
                      variant={pathname === "/settings" ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        pathname === "/settings" && "bg-secondary text-secondary-foreground",
                      )}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center w-full justify-start p-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || ""} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
