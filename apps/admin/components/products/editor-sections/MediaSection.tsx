"use client"

import { ImageIcon, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@repo/ui"
import Image from "next/image"

interface MediaSectionProps {
  image: string | null;
  // In a real app, we'd have onImageAdd, onImageDelete, etc.
}

export function MediaSection({ image }: MediaSectionProps) {
  return (
    <Card className=" border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Media & Visuals
          </CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="group relative aspect-square w-full  bg-secondary/30 border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden">
          {image ? (
            <>
              <Image src={image} alt="Product" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8  bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8  bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center p-3">
              <div className="h-10 w-10  bg-primary/10 text-primary flex items-center justify-center mb-1">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-xs tracking-tight">Add Main Image</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">
                  Recommended 1080x1080
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Future: Media Grid for Gallery */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square  bg-secondary/20 border border-border flex items-center justify-center cursor-pointer hover:bg-secondary/40 transition-colors"
            >
              <Plus className="h-3 w-3 text-muted-foreground" />
            </div>
          ))}
          <div className="aspect-square  bg-muted border border-border flex items-center justify-center text-muted-foreground font-black text-[10px]">
            +5
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
