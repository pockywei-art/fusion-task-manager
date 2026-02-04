"use client";

import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { List, Task } from "@/types/database";
import { TaskCard } from "./TaskCard";
import { MoreHorizontal, Plus } from "lucide-react";

interface ColumnProps {
    list: List;
    tasks: Task[];
    onAddTask: () => void;
    onTaskClick: (task: Task) => void;
}

export function Column({ list, tasks, onAddTask, onTaskClick }: ColumnProps) {
    return (
        <div className="flex-shrink-0 w-80 bg-[#f1efe9]/30 rounded-2xl flex flex-col max-h-full border border-[#e8e3dd] shadow-sm">
            {/* Column Header */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[#4a3f35] text-base">{list.title}</h3>
                    <span className="bg-[#8a9a5b]/10 text-[#8a9a5b] text-[10px] px-2 py-0.5 rounded-full font-bold shadow-inner">
                        {tasks.length}
                    </span>
                </div>
                <button className="text-[#a68b6d] hover:text-[#4a3f35] p-1.5 rounded-lg hover:bg-[#f1efe9] transition-all">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto min-h-[100px] px-3 pb-4 space-y-3">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </SortableContext>
            </div>

            {/* Column Footer */}
            <div className="p-4">
                <button
                    onClick={onAddTask}
                    className="flex items-center gap-2 w-full px-4 py-3 text-[#a68b6d] hover:text-[#8a9a5b] hover:bg-[#8a9a5b]/10 rounded-xl text-sm font-bold transition-all group border border-dashed border-[#e8e3dd] hover:border-[#8a9a5b]/30"
                >
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />
                    新增卡片
                </button>
            </div>
        </div>
    );
}
