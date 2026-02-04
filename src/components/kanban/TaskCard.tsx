"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/database";
import { Calendar, User2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-slate-100 border-2 border-blue-200 rounded-lg p-4 mb-3 min-h-[100px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white border border-slate-200 rounded-lg p-4 mb-3 shadow-sm hover:border-blue-400 cursor-grab active:cursor-grabbing group transition-all"
        >
            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    task.priority === 'high' ? "bg-red-50 text-red-600" :
                        task.priority === 'medium' ? "bg-orange-50 text-orange-600" :
                            "bg-emerald-50 text-emerald-600"
                )}>
                    {task.priority}
                </span>
            </div>

            <h4 className="text-sm font-semibold text-slate-800 leading-tight mb-3">
                {task.title}
            </h4>

            {/* Footer Info */}
            <div className="flex items-center justify-between mt-4 text-slate-400">
                <div className="flex items-center gap-3">
                    {task.end_date && (
                        <div className="flex items-center gap-1 text-[11px]">
                            <Calendar size={12} />
                            {format(new Date(task.end_date), "MMM d")}
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-[11px]">
                        <MessageSquare size={12} />
                        <span>2</span>
                    </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                    <User2 size={14} />
                </div>
            </div>
        </div>
    );
}
