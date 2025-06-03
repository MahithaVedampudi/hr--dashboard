"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
}>({
  toast: () => {},
  dismiss: () => {},
})

export type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

  const toast = React.useCallback(
    ({ id, ...props }: ToastProps) => {
      const toastId = id || Math.random().toString(36).substring(2, 9)
      const duration = props.duration || 5000

      setToasts((prev) => [...prev, { id: toastId, ...props }])

      if (duration !== Number.POSITIVE_INFINITY) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastId))
        }, duration)
      }

      return toastId
    },
    [setToasts],
  )

  const dismiss = React.useCallback(
    (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    },
    [setToasts],
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function Toast({
  title,
  description,
  action,
  variant = "default",
  onDismiss,
}: ToastProps & { onDismiss: () => void }) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 rounded-md border p-4 shadow-lg animate-in slide-in-from-bottom-5",
        variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50"
          : "border-gray-200 bg-white text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      )}
    >
      <div className="flex-1 space-y-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
      </div>
      {action}
      <Button variant="ghost" size="icon" onClick={onDismiss} className="h-6 w-6">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
