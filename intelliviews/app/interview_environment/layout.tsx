"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
    { label: "Dashboard", href: "/interview_environment" },
    { label: "Technical", href: "/interview_environment/technical" },
    { label: "Behavioural", href: "/interview_environment/behavioural" },
    { label: "Simulation", href: "/interview_environment/simulation" },
];

export default function InterviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [timer] = useState("45:00");

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            {/* ─── Top bar ─── */}
            <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
                        IV
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        Intelli<span className="text-indigo-400">View</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-indigo-600/20 text-indigo-400"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Timer & candidate info */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-mono">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        {timer}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                        C
                    </div>
                </div>
            </header>

            {/* ─── Main content ─── */}
            <main className="flex-1 overflow-y-auto">{children}</main>

            {/* ─── Footer ─── */}
            <footer className="border-t border-zinc-800 bg-zinc-900 px-6 py-3 flex items-center justify-between text-xs text-zinc-500">
                <span>IntelliView AI Interview Platform</span>
                <span>Session Active • Responses are being recorded</span>
            </footer>
        </div>
    );
}
