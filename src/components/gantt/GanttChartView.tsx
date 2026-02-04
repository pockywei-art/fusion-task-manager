"use client";

import React from "react";
import { Gantt, Task as GanttTask, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Task } from "@/types/database";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";

import { useTasks } from "@/hooks/useTasks";

export function GanttChartView() {
    const { tasks, loading } = useTasks();
    const [view, setView] = React.useState<ViewMode>(ViewMode.Day);

    const ganttTasks: GanttTask[] = tasks
        .filter(t => t.start_date || t.end_date)
        .map(t => ({
            start: t.start_date ? new Date(t.start_date) : new Date(t.end_date!),
            end: t.end_date ? new Date(t.end_date) : addDays(new Date(t.start_date!), 1),
            name: t.title,
            id: t.id,
            type: "task",
            progress: t.status === 'done' ? 100 : t.status === 'doing' ? 50 : 0,
            isDisabled: false,
            styles: {
                progressColor: t.priority === 'high' ? "#d27d56" : t.priority === 'medium' ? "#cc7722" : "#8a9a5b",
                progressSelectedColor: t.priority === 'high' ? "#c26d46" : t.priority === 'medium' ? "#bc6712" : "#7a8a4b"
            },
        }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a9a5b]"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#fdfbfa] rounded-2xl border border-[#e8e3dd] overflow-hidden shadow-sm">
            {/* Gantt Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#f1efe9]">
                <h3 className="text-xl font-bold text-[#4a3f35]">時間軸時程</h3>
                <div className="flex bg-[#f1efe9] p-1.5 rounded-xl border border-[#e8e3dd]">
                    {[
                        { label: "小時", value: ViewMode.Hour },
                        { label: "1/4 天", value: ViewMode.QuarterDay },
                        { label: "半天", value: ViewMode.HalfDay },
                        { label: "天", value: ViewMode.Day },
                        { label: "週", value: ViewMode.Week },
                        { label: "月", value: ViewMode.Month },
                    ].map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => setView(mode.value)}
                            className={cn(
                                "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                                view === mode.value
                                    ? "bg-white text-[#8a9a5b] shadow-sm ring-1 ring-[#e8e3dd]"
                                    : "text-[#a68b6d] hover:text-[#4a3f35] hover:bg-white/50"
                            )}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gantt Content */}
            <div className="flex-1 overflow-auto p-6 gantt-container">
                {ganttTasks.length > 0 ? (
                    <Gantt
                        tasks={ganttTasks}
                        viewMode={view}
                        listCellWidth="200px"
                        columnWidth={view === ViewMode.Month ? 300 : 80}
                        headerHeight={50}
                        rowHeight={60}
                        barCornerRadius={10}
                        barFill={80}
                        fontSize="13px"
                        locale="zh"
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#a68b6d]">
                        <p className="font-bold">找不到有排程的任務。</p>
                    </div>
                )}
            </div>

            <style jsx global>{`
        .gantt-container ._3_h_P {
          background-color: transparent !important;
        }
        .gantt-container ._3_z_8 {
          border-color: #f1efe9 !important;
        }
        .gantt-container ._11v_X {
          color: #4a3f35 !important;
          font-weight: 700 !important;
        }
        .gantt-container ._3_h_P rect {
          fill: #fdfbfa !important;
        }
      `}</style>
        </div>
    );
}


