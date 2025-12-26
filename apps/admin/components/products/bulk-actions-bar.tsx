"use client"

import { Trash2, Archive, CheckCircle2, X } from "lucide-react"
import { Button } from "@repo/ui"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

interface BulkActionsBarProps {
  selectedCount: number
  onClear: () => void
}

export function BulkActionsBar({ selectedCount, onClear }: BulkActionsBarProps) {
  const t = useTranslations("Admin.products")

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 px-6 py-3 bg-card border border-border   ring-1 ring-white/5"
        >
          <div className="flex items-center gap-2 border-e border-border pe-4">
            <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs font-bold ">
              {selectedCount}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
                {t("bulkActions.selected", { count: selectedCount })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title={t("status.active")} className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary ">
              <CheckCircle2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title={t("status.archived")} className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary ">
              <Archive className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title={t("table.actions")} className="h-9 w-9 text-destructive hover:text-destructive/80 hover:bg-destructive/10 ">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <button 
            onClick={onClear}
            title={t("bulkActions.clear")}
            className="ms-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
