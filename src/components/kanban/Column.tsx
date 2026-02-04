"use client";

import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { List, Task } from "@/types/database";
import { TaskCard } from "./TaskCard";
import { MoreHorizontal, Plus } from "lucide-react";

interface ColumnProps {
    list: List;
    tasks: Task[];
}

export function Column({ list, tasks }: ColumnProps) {
    return (
        <div className="flex-shrink-0 w-80 bg-slate-100/50 rounded-xl flex flex-col max-h-full border border-slate-200/60">
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700">{list.title}</h3>
                    <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {tasks.length}
                    </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto min-h-[50px] px-3 pb-4">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>

            {/* Column Footer */}
            <div className="p-3">
                <button className="flex items-center gap-2 w-full px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg text-sm font-medium transition-all group">
                    <Plus size={16} className="group-hover:scale-110 transition-transform" />
                    新增卡片
                </button>
            </div>
        </div>
    );
}
