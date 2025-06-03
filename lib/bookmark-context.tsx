"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Employee } from "@/lib/types"

interface BookmarkContextType {
  bookmarks: Employee[]
  addBookmark: (employee: Employee) => void
  removeBookmark: (id: number) => void
  isBookmarked: (id: number) => boolean
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Employee[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("hr-bookmarks")
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("hr-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = (employee: Employee) => {
    setBookmarks((prev) => [...prev.filter((b) => b.id !== employee.id), employee])
  }

  const removeBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const isBookmarked = (id: number) => {
    return bookmarks.some((b) => b.id === id)
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider")
  }
  return context
}
