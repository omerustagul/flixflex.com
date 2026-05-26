"use client"

import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list"

export function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}) {
  return (
    <div className="ff-shape-container flex items-center justify-center px-1 border border-[var(--border)] bg-[var(--surface)] overflow-hidden h-9">
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          "ff-shape-button w-7 h-7 flex items-center justify-center transition-colors",
          mode === "grid"
            ? "bg-[var(--ff-purple)] text-white"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        )}
      >
        <LayoutGrid size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "ff-shape-button w-7 h-7 flex items-center justify-center transition-colors",
          mode === "list"
            ? "bg-[var(--ff-purple)] text-white"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        )}
      >
        <List size={14} />
      </button>
    </div>
  )
}
