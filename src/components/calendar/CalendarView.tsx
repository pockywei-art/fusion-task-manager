"use client";

import React, { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Task } from "@/types/database";
import { cn } from "@/lib/utils";

// Mock tasks for calendar demo
const MOCK_CALENDAR_TASKS: Task[] = [
    { id: "task-1", list_id: "list-1", title: "每月同步會議", description: "", position: 1, start_date: null, end_date: new Date().toISOString(), assignee_id: null, priority: "high", status: "todo", created_at: "", updated_at: "" },
    { id: "task-4", list_id: "list-1", title: "專案截稿日", description: "", position: 2, start_date: null, end_date: addMonths(new Date(), 0).toISOString(), assignee_id: null, priority: "high", status: "todo", created_at: "", updated_at: "" },
];

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">
                    {format(currentDate, "yyyy年 MMMM", { locale: zhTW })}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-1.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        今天
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {["週日", "週一", "週二", "週三", "週四", "週五", "週六"].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                {days.map((day, idx) => {
                    const dayTasks = MOCK_CALENDAR_TASKS.filter(t => t.end_date && isSameDay(new Date(t.end_date), day));

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[120px] p-2 border-r border-b border-slate-100 transition-colors hover:bg-slate-50/30",
                                !isSameMonth(day, monthStart) && "bg-slate-50/50 text-slate-300"
                            )}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={cn(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mt-1",
                                    isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-slate-600"
                                )}>
                                    {format(day, "d")}
                                </span>
                            </div>

                            {/* Tasks in this day */}
                            <div className="space-y-1">
                                {dayTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "group px-2 py-1 rounded text-[10px] font-medium truncate flex items-center justify-between",
                                            task.priority === 'high' ? "bg-red-50 text-red-600 border border-red-100" :
                                                "bg-blue-50 text-blue-600 border border-blue-100"
                                        )}
                                    >
                                        <span>{task.title}</span>
                                        <MoreVertical size={10} className="opacity-0 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
