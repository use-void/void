"use client"

import { FileDigit, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@repo/ui"

export function DigitalDeliverySection() {
  return (
    <Card className=" border-border overflow-hidden bg-blue-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <FileDigit className="h-4 w-4" />
          <CardTitle className="text-base font-semibold">Digital Delivery</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="p-8 border-2 border-dashed border-blue-200 dark:border-blue-900/50  bg-blue-500/5 flex flex-col items-center justify-center text-center gap-3">
          <div className="h-12 w-12  bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Plus className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Upload Digital File</h4>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, ZIP, MP4 or any digital asset up to 2GB.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Choose File
          </Button>
        </div>
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Download Link / Instruction
          </label>
          <Input
            placeholder="https://example.com/download/..."
            className="bg-secondary/20 h-10 "
          />
          <p className="text-[10px] text-muted-foreground uppercase opacity-70">
            Optional: Provide a secure link or activation steps.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
