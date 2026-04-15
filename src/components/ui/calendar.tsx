"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface CalendarProps {
  className?: string
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  locale?: unknown
}

const toInputDate = (date?: Date) => {
  if (!date) return ""
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
}: CalendarProps) {
  const selectedValue = toInputDate(selected)

  const minSelectableDate =
    disabled && disabled(new Date())
      ? undefined
      : toInputDate(new Date())

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    if (!nextValue) {
      onSelect?.(undefined)
      return
    }

    const pickedDate = new Date(`${nextValue}T00:00:00`)
    if (disabled?.(pickedDate)) {
      return
    }

    onSelect?.(pickedDate)
  }

  return (
    <div className={cn("p-3", className)}>
      <input
        type="date"
        value={selectedValue}
        min={minSelectableDate}
        onChange={handleDateChange}
        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
