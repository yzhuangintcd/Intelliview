"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const stages = [
    {
        id: "technical",
        title: "Technical Assessment",
        description:
            "Solve real-world coding challenges, debug existing systems, and demonstrate your technical problem-solving skills in a simulated development environment.",
        icon: "💻",
        href: "/interview_environment/technical",
        duration: "30 min",
        status: "ready",
        tasks: 1,
    },
    {
        id: "behavioural",
        title: "Behavioural Assessment",
        description:
            "Navigate realistic workplace scenarios that test your communication, leadership, conflict resolution, and decision-making abilities.",
        icon: "🧠",
        href: "/interview_environment/behavioural",
        duration: "25 min",
        status: "ready",
        tasks: 1,
    },
    {
        id: "simulation",
        title: "Work Simulation",
        description:
            "Step into a day-in-the-life scenario: attend stand-ups, handle Slack messages, prioritise tasks, and ship a feature under real constraints.",
        icon: "🏢",
        href: "/interview_environment/technical2",
        duration: "35 min",
        status: "ready",
        tasks: 1,
    },
];

export default function MainRouter() {
    const [candidateName] = useState("Candidate");
    const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());

    // Check completion status from localStorage
    useEffect(() => {
        const completed = new Set<string>();
        
        // Check technical1
        const technical1Completed = localStorage.getItem('technical1_completed');
        if (technical1Completed) {
            try {
                const completedTasks = JSON.parse(technical1Completed);
                if (completedTasks.length > 0) {
                    completed.add('technical');
                }
            } catch (e) {
                console.error('Failed to parse technical1 completion', e);
            }
        }
        
        // Check technical2 (simulation)
        const technical2Completed = localStorage.getItem('technical2_completed');
        if (technical2Completed) {
            try {
                const completedTasks = JSON.parse(technical2Completed);
                if (completedTasks.length > 0) {
                    completed.add('simulation');
                }
            } catch (e) {
                console.error('Failed to parse technical2 completion', e);
            }
        }
        
        // Check behavioural
        const behaviouralProgress = localStorage.getItem('behavioural_progress');
        if (behaviouralProgress) {
            try {
                const progress = JSON.parse(behaviouralProgress);
                const hasCompleted = Object.values(progress).some((p: any) => p.completed);
                if (hasCompleted) {
                    completed.add('behavioural');
                }
            } catch (e) {
                console.error('Failed to parse behavioural progress', e);
            }
        }
        
        setCompletedStages(completed);
    }, []);

    const completionPercentage = (completedStages.size / stages.length) * 100;

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">
            {/* Hero / Welcome */}
            <section className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome, {candidateName} 👋
                </h1>
                <p className="mt-2 max-w-2xl text-zinc-400 leading-relaxed">
                    This AI-powered interview simulates a real work environment. You'll
                    move through three stages — technical, behavioural, and a full work
                    simulation — designed to assess your skills holistically. Take your
                    time, think out loud, and treat this like a normal working day.
                </p>
            </section>

            {/* Progress overview */}
            <section className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                        Overall Progress
                    </h2>
                    <span className="text-sm text-zinc-500">{completedStages.size} / {stages.length} stages complete</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800">
                    <div
                        className="h-2 rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </section>

            {/* Stage cards */}
            <section className="grid gap-6 md:grid-cols-3">
                {stages.map((stage) => {
                    const isCompleted = completedStages.has(stage.id);
                    return (
                        <div
                            key={stage.id}
                            className={`group relative flex flex-col rounded-xl border p-6 transition-all ${stage.status === "ready"
                                    ? "border-indigo-600/40 bg-zinc-900 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-900/20"
                                    : "border-zinc-800 bg-zinc-900/60 opacity-70"
                                }`}
                        >
                            {/* Status badge */}
                            <span
                                className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${isCompleted
                                        ? "bg-emerald-900/50 text-emerald-400"
                                        : stage.status === "ready"
                                            ? "bg-indigo-900/50 text-indigo-400"
                                            : "bg-zinc-800 text-zinc-500"
                                    }`}
                            >
                                {isCompleted ? "✓ Done" : stage.status === "ready" ? "Ready" : "Locked"}
                            </span>

                            <span className="text-3xl mb-4">{stage.icon}</span>
                            <h3 className="text-lg font-semibold mb-2">{stage.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                                {stage.description}
                            </p>

                        <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
                            <span>⏱ {stage.duration}</span>
                            <span>{stage.tasks} task{stage.tasks > 1 ? 's' : ''}</span>
                        </div>

                        {isCompleted ? (
                            <Link
                                href={stage.href}
                                className="mt-4 flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                            >
                                ✓ Completed - Review →
                            </Link>
                        ) : stage.status === "ready" ? (
                            <Link
                                href={stage.href}
                                className="mt-4 flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                            >
                                Begin Stage →
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="mt-4 flex items-center justify-center rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-500 cursor-not-allowed"
                            >
                                Complete previous stage
                            </button>
                        )}
                    </div>
                );})}
            </section>

            {/* Tips card */}
            <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                    💡 Before You Start
                </h2>
                <ul className="space-y-2 text-sm text-zinc-400 leading-relaxed list-disc list-inside">
                    <li>
                        Your responses are evaluated by AI — speak naturally and explain
                        your reasoning.
                    </li>
                    <li>
                        There are no trick questions. We're looking for how you think, not
                        just what you know.
                    </li>
                    <li>
                        You can navigate between stages from the top bar once they're
                        unlocked.
                    </li>
                    <li>
                        The timer is advisory. Quality matters more than speed.
                    </li>
                </ul>
            </section>
        </div>
    );
}
