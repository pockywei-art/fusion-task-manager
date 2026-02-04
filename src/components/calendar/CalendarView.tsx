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

import { useTasks } from "@/hooks/useTasks";

export function CalendarView() {
    const { tasks, loading } = useTasks();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a9a5b]"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#fdfbfa] rounded-2xl border border-[#e8e3dd] overflow-hidden shadow-sm">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#f1efe9]">
                <h3 className="text-xl font-bold text-[#4a3f35]">
                    {format(currentDate, "yyyy年 MMMM", { locale: zhTW })}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2.5 hover:bg-[#a68b6d]/10 rounded-full text-[#a68b6d] transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-5 py-2 text-sm font-bold text-[#6d6257] border border-[#e8e3dd] rounded-xl hover:bg-[#f1efe9] transition-all shadow-sm"
                    >
                        今天
                    </button>
                    <button onClick={nextMonth} className="p-2.5 hover:bg-[#a68b6d]/10 rounded-full text-[#a68b6d] transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 border-b border-[#f1efe9] bg-[#fdfbfa]">
                {["週日", "週一", "週二", "週三", "週四", "週五", "週六"].map((day) => (
                    <div key={day} className="py-3 text-center text-[11px] font-bold text-[#a68b6d] uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                {days.map((day, idx) => {
                    const dayTasks = tasks.filter(t => t.end_date && isSameDay(new Date(t.end_date), day));
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => alert(`您點擊了 ${format(day, "yyyy/MM/dd")}，可於此實作新增任務功能。`)}
                            className={cn(
                                "min-h-[140px] p-3 border-r border-b border-[#f1efe9] transition-all cursor-pointer group",
                                isCurrentMonth ? "bg-white hover:bg-[#f1efe9]/30" : "bg-[#fdfbfa] text-[#d6cdc5]"
                            )}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={cn(
                                    "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all",
                                    isToday ? "bg-[#8a9a5b] text-white shadow-md shadow-[#8a9a5b]/20" :
                                        isCurrentMonth ? "text-[#4a3f35] group-hover:bg-[#f1efe9]" : "text-[#d6cdc5]"
                                )}>
                                    {format(day, "d")}
                                </span>
                            </div>

                            {/* Tasks in this day */}
                            <div className="space-y-1.5">
                                {dayTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={(e) => e.stopPropagation()}
                                        className={cn(
                                            "group/task px-2.5 py-1.5 rounded-lg text-[11px] font-bold truncate flex items-center justify-between shadow-sm transition-all hover:scale-[1.02]",
                                            task.priority === 'high' ? "bg-[#d27d56]/10 text-[#d27d56] border border-[#d27d56]/20" :
                                                "bg-[#8a9a5b]/10 text-[#8a9a5b] border border-[#8a9a5b]/20"
                                        )}
                                    >
                                        <span className="truncate">{task.title}</span>
                                        <MoreVertical size={12} className="opacity-0 group-hover/task:opacity-100 text-[#a68b6d]" />
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
