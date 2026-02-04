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
    onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
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
                className="opacity-30 bg-[#f1efe9] border-2 border-[#8a9a5b]/30 rounded-xl p-4 mb-3 min-h-[100px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                // Prevent modal if we are dragging
                if (transform) return;
                onClick?.();
            }}
            className="bg-white border border-[#e8e3dd] rounded-xl p-4 mb-3 shadow-sm hover:border-[#8a9a5b] hover:shadow-md cursor-grab active:cursor-grabbing group transition-all duration-200"
        >
            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    task.priority === 'high' ? "bg-[#d27d56]/10 text-[#d27d56]" :
                        task.priority === 'medium' ? "bg-[#cc7722]/10 text-[#cc7722]" :
                            "bg-[#8a9a5b]/10 text-[#8a9a5b]"
                )}>
                    {task.priority === 'high' ? '高優先級' : task.priority === 'medium' ? '中優先級' : '低優先級'}
                </span>
            </div>

            <h4 className="text-sm font-bold text-[#4a3f35] leading-snug mb-3 group-hover:text-[#8a9a5b] transition-colors">
                {task.title}
            </h4>

            {/* Footer Info */}
            <div className="flex items-center justify-between mt-4 text-[#a68b6d]">
                <div className="flex items-center gap-3">
                    {task.end_date && (
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                            <Calendar size={12} className="text-[#a68b6d]" />
                            {format(new Date(task.end_date), "M月d日")}
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-[11px] font-medium">
                        <MessageSquare size={12} className="text-[#a68b6d]" />
                        <span>2</span>
                    </div>
                </div>

                <div className="w-6 h-6 rounded-lg bg-[#f1efe9] border border-[#e8e3dd] flex items-center justify-center text-[#8a9a5b] overflow-hidden shadow-inner">
                    <User2 size={14} />
                </div>
            </div>
        </div>
    );
}
