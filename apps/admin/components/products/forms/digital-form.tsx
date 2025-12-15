"use client";

import { useTranslations } from "next-intl";
import { Button, Input, Label, Textarea } from "@repo/ui";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Link } from "@repo/i18n/navigation";

export function DigitalProductForm({ defaultValues }: { defaultValues?: any }) {
    return (
        <div className="max-w-4xl space-y-8">
            <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
                <div className="space-y-8">
                    {/* General Info */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">General Information</h3>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" defaultValue={defaultValues?.name} placeholder="e.g. Digital Art Pack" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" defaultValue={defaultValues?.description} className="min-h-[120px]" placeholder="Product description..." />
                            </div>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Digital File</h3>
                        <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-900/50 transition-colors cursor-pointer">
                            <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                <Upload className="h-5 w-5 text-zinc-400" />
                            </div>
                            <p className="text-sm font-medium text-white">Click to upload or drag and drop</p>
                            <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Pricing</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" defaultValue={defaultValues?.price} placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Status</h3>
                        <div className="space-y-4">
                            <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white" defaultValue={defaultValues?.status || "active"}>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                <Link href="/products">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </Link>
                <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Product
                </Button>
            </div>
        </div>
    );
}
