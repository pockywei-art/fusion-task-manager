"use client";

import React from "react";
import { X, Calendar, AlignLeft, BarChart2, User, Clock } from "lucide-react";
import { Task } from "@/types/database";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskModalProps {
    task: Task;
    onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-[#fdfbfa] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#e8e3dd]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#f1efe9]">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm",
                            task.priority === 'high' ? "bg-[#d27d56]" :
                                task.priority === 'medium' ? "bg-[#cc7722]" :
                                    "bg-[#8a9a5b]"
                        )}>
                            <BarChart2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#4a3f35] leading-tight">{task.title}</h2>
                            <p className="text-xs text-[#a68b6d] font-semibold uppercase tracking-wider mt-0.5">
                                任務編號: {task.id.split('-')[1]} • {task.priority === 'high' ? '高優先級' : task.priority === 'medium' ? '中優先級' : '低優先級'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#a68b6d]/10 rounded-full text-[#a68b6d] transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Description Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#4a3f35] font-bold">
                            <AlignLeft size={18} className="text-[#a68b6d]" />
                            <span>任務描述</span>
                        </div>
                        <div className="bg-[#f1efe9]/50 p-4 rounded-xl border border-[#e8e3dd] min-h-[100px] text-[#6d6257] text-sm leading-relaxed">
                            {task.description || "尚無詳細描述。"}
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[#4a3f35] font-bold">
                                <Calendar size={18} className="text-[#a68b6d]" />
                                <span>截止日期</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[#e8e3dd] rounded-xl shadow-sm">
                                <Clock size={16} className="text-[#a68b6d]" />
                                <span className="text-sm text-[#4a3f35]">
                                    {task.end_date ? format(new Date(task.end_date), "yyyy年 M月 d日") : "未設定日期"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[#4a3f35] font-bold">
                                <User size={18} className="text-[#a68b6d]" />
                                <span>負責人</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[#e8e3dd] rounded-xl shadow-sm">
                                <div className="w-6 h-6 rounded-full bg-[#8a9a5b] flex items-center justify-center text-white text-[10px] font-bold">
                                    W
                                </div>
                                <span className="text-sm text-[#4a3f35]">Weis (正式成員)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-[#f1efe9]/30 p-6 flex justify-end gap-3 border-t border-[#f1efe9]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-[#6d6257] hover:text-[#4a3f35] transition-colors"
                    >
                        關閉
                    </button>
                    <button className="px-6 py-2.5 bg-[#8a9a5b] text-white rounded-xl text-sm font-bold hover:bg-[#7a8a4b] transition-all shadow-md active:scale-95 shadow-[#8a9a5b]/20">
                        編輯任務
                    </button>
                </div>
            </div>
        </div>
    );
}
