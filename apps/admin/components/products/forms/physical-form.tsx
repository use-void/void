"use client";

import { useTranslations } from "next-intl";
import { Button, Input, Label, Textarea } from "@repo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@repo/i18n/navigation";

export function PhysicalProductForm({ defaultValues }: { defaultValues?: any }) {
    // const t = useTranslations("Admin.products");

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
                                <Input id="name" defaultValue={defaultValues?.name} placeholder="e.g. Cotton T-Shirt" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" defaultValue={defaultValues?.description} className="min-h-[120px]" placeholder="Product description..." />
                            </div>
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
                            <div className="grid gap-2">
                                <Label htmlFor="compareAt">Compare at Price</Label>
                                <Input id="compareAt" type="number" defaultValue={defaultValues?.compareAt} placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Inventory</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                                <Input id="sku" defaultValue={defaultValues?.sku} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="barcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                                <Input id="barcode" defaultValue={defaultValues?.barcode} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" type="number" defaultValue={defaultValues?.stock} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="status">Product Status</Label>
                            </div>
                            <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white" defaultValue={defaultValues?.status || "active"}>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-white">Organization</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Product Type</Label>
                                <Input id="type" value="Physical" disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="vendor">Vendor</Label>
                                <Input id="vendor" defaultValue={defaultValues?.vendor} />
                            </div>
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
