import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BookmarkProvider } from "@/lib/bookmark-context"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/ui/use-toast"
import { Sidebar } from "@/components/sidebar"

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
              <ToastProvider>
                <div className="flex h-screen bg-background">
                  <Sidebar />
                  <div className="flex-1 overflow-auto">
                    <main className="container mx-auto px-4 py-8">{children}</main>
                  </div>
                </div>
              </ToastProvider>
            </BookmarkProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
