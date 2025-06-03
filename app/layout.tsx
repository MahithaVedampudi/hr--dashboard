import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BookmarkProvider } from "@/lib/bookmark-context"
import { AuthProvider } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HR Performance Dashboard",
  description: "Advanced HR dashboard for managing employee performance and analytics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <BookmarkProvider>
              <div className="flex h-screen bg-background">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <AuthGuard>
                    <main className="container mx-auto px-4 py-8">{children}</main>
                  </AuthGuard>
                </div>
              </div>
              <Toaster />
            </BookmarkProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
