"use client";

import { useEffect, useState } from "react";

export function Copyright() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    if (!year) return <span className="opacity-0">© 2025 Store. All rights reserved.</span>;

    return <span>© {year} Store. All rights reserved.</span>;
}
