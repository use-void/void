"use client";

import { useTransition } from "react";
import { useParams } from "next/navigation";
import { Button, Input, Label, Textarea } from "@repo/ui";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
// استيراد مباشر من الـ Actions المحدثة
import { 
    createProduct, 
    updateProduct, 
    type SerializedProduct, 
    type ProductInput 
} from "@/lib/actions/product.actions";

interface PhysicalProductFormProps {
    defaultValues?: Partial<SerializedProduct>;
    isEditing?: boolean;
}

export function PhysicalProductForm({ defaultValues, isEditing }: PhysicalProductFormProps) {
    const params = useParams();
    const locale = params.locale as string;
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const data: ProductInput = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: formData.get("price") as string,
            compareAtPrice: formData.get("compareAt") as string,
            status: formData.get("status") as "draft" | "active" | "archived",
            sku: formData.get("sku") as string,
            stock: formData.get("stock") as string, // سيتم تحويله لرقم في السيرفر
        };

        startTransition(async () => {
            if (isEditing && defaultValues?._id) {
                await updateProduct(defaultValues._id, data, locale);
            } else {
                await createProduct(data, "physical", locale);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
            <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
                <div className="space-y-8">
                    {/* General Info */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-foreground">General Information</h3>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input 
                                    id="name" 
                                    name="name" 
                                    defaultValue={defaultValues?.name ?? undefined} 
                                    placeholder="e.g. Cotton T-Shirt" 
                                    required 
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                    id="description" 
                                    name="description" 
                                    defaultValue={defaultValues?.description ?? undefined} 
                                    className="min-h-[120px]" 
                                    placeholder="Product description..." 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-foreground">Pricing</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input 
                                    id="price" 
                                    name="price" 
                                    type="number" 
                                    step="0.01" 
                                    defaultValue={defaultValues?.price ?? undefined} 
                                    placeholder="0.00" 
                                    required 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="compareAt">Compare at Price</Label>
                                <Input 
                                    id="compareAt" 
                                    name="compareAt" 
                                    type="number" 
                                    step="0.01" 
                                    defaultValue={defaultValues?.compareAtPrice ?? undefined} 
                                    placeholder="0.00" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-foreground">Inventory</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input 
                                    id="sku" 
                                    name="sku" 
                                    defaultValue={defaultValues?.physicalDetails?.sku ?? undefined} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Quantity</Label>
                                <Input 
                                    id="stock" 
                                    name="stock" 
                                    type="number" 
                                    defaultValue={defaultValues?.physicalDetails?.stock ?? undefined} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-foreground">Status</h3>
                        <div className="space-y-4">
                            <Label htmlFor="status">Product Status</Label>
                            <select 
                                name="status"
                                className="w-full bg-background border border-input rounded-md p-2 text-sm text-foreground focus:ring-1 focus:ring-ring" 
                                defaultValue={defaultValues?.status ?? "active"}
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-card">
                        <h3 className="font-medium text-foreground">Organization</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Product Type</Label>
                                <Input value="Physical" disabled className="bg-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
                <Link href="/products">
                    <Button variant="outline" type="button" disabled={isPending}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {isEditing ? "Update Product" : "Save Product"}
                </Button>
            </div>
        </form>
    );
}