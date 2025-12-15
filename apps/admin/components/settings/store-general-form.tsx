"use client";

import { Button, Input, Label, Textarea } from "@repo/ui";
import { useTranslations } from "next-intl";

export function StoreGeneralForm() {
    // const t = useTranslations("Admin.settings");

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" placeholder="Enter your store name" defaultValue="My Awesome Store" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your store..." className="h-24" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input id="currency" defaultValue="USD" disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input id="timezone" defaultValue="UTC" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
            </div>
        </div>
    );
}
