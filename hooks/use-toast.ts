"use client"

import { useState, useEffect } from "react"

type ToastVariant = "default" | "destructive"

interface ToastProps {
  id?: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface Toast extends ToastProps {
  id: string
}

let toastCount = 0

function generateId(): string {
  toastCount += 1
  return toastCount.toString()
}

const toasts: Toast[] = []
const listeners: Array<(toasts: Toast[]) => void> = []

function addToast(toast: ToastProps): string {
  const id = toast.id || generateId()
  const newToast: Toast = {
    ...toast,
    id,
  }

  toasts.push(newToast)

  // Auto remove after duration
  const duration = toast.duration || 5000
  setTimeout(() => {
    removeToast(id)
  }, duration)

  // Notify listeners
  listeners.forEach((listener) => listener([...toasts]))

  return id
}

function removeToast(id: string): void {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    listeners.forEach((listener) => listener([...toasts]))
  }
}

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setToastList)
    return () => {
      const index = listeners.indexOf(setToastList)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const toast = (props: ToastProps) => {
    return addToast(props)
  }

  const dismiss = (id: string) => {
    removeToast(id)
  }

  return {
    toast,
    dismiss,
    toasts: toastList,
  }
}

const toast = (props: ToastProps) => {
  return addToast(props)
}

export { toast }
