"use client";

import React from "react";
import { Gantt, Task as GanttTask, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Task } from "@/types/database";
import { addDays } from "date-fns";

// Mock data converted to Gantt format
const MOCK_GANTT_TASKS: GanttTask[] = [
    {
        start: new Date(),
        end: addDays(new Date(), 5),
        name: "Design System Phase 1",
        id: "task-1",
        type: "task",
        progress: 45,
        isDisabled: false,
        styles: { progressColor: "#2563eb", progressSelectedColor: "#1d4ed8" },
    },
    {
        start: addDays(new Date(), 2),
        end: addDays(new Date(), 10),
        name: "Authentication Integration",
        id: "task-2",
        type: "task",
        progress: 20,
        isDisabled: false,
        styles: { progressColor: "#6366f1", progressSelectedColor: "#4f46e5" },
    },
    {
        start: addDays(new Date(), 6),
        end: addDays(new Date(), 15),
        name: "Kanban Performance Optimization",
        id: "task-3",
        type: "task",
        progress: 0,
        isDisabled: false,
        styles: { progressColor: "#8b5cf6", progressSelectedColor: "#7c3aed" },
    },
];

export function GanttChartView() {
    const [view, setView] = React.useState<ViewMode>(ViewMode.Day);

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Gantt Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Timeline Schedule</h3>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {(["Hour", "Quarter Day", "Half Day", "Day", "Week", "Month"] as ViewMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setView(mode)}
                            className={cn(
                                "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                view === mode ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gantt Content */}
            <div className="flex-1 overflow-auto p-4 gantt-container">
                {MOCK_GANTT_TASKS.length > 0 ? (
                    <Gantt
                        tasks={MOCK_GANTT_TASKS}
                        viewMode={view}
                        listCellWidth="200px"
                        columnWidth={view === ViewMode.Month ? 300 : 65}
                        headerHeight={50}
                        rowHeight={50}
                        barCornerRadius={6}
                        barFill={85}
                        fontSize="12px"
                        locale="en-US"
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <p>No tasks with schedule found.</p>
                    </div>
                )}
            </div>

            <style jsx global>{`
        .gantt-container ._3_h_P {
          background-color: transparent !important;
        }
        .gantt-container ._3_z_8 {
          border-color: #f1f5f9 !important;
        }
      `}</style>
        </div>
    );
}

// Helper to keep code clean since cn is in @/lib/utils but I need it here
import { cn } from "@/lib/utils";
