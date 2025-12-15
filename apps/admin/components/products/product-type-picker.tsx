"use client";

import { Link } from "@repo/i18n/navigation";
import { Package, Smartphone, ChevronRight } from "lucide-react";

export function ProductTypePicker() {
    const types = [
        {
            id: "physical",
            title: "Physical Product",
            description: "A tangible item that you ship to customers.",
            icon: Package,
            href: "/products/create/physical"
        },
        {
            id: "digital",
            title: "Digital Product",
            description: "A file or digital asset that customers download.",
            icon: Smartphone, // Using Smartphone as proxy for digital device/file
            href: "/products/create/digital"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {types.map((type) => (
                <Link
                    key={type.id}
                    href={type.href}
                    className="flex items-start gap-4 p-6 border border-zinc-800 rounded-xl bg-card hover:bg-zinc-900/50 transition-colors group"
                >
                    <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-zinc-800 transition-colors">
                        <type.icon className="h-6 w-6 text-zinc-400 group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white">{type.title}</h3>
                            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            {type.description}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
