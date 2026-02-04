"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CalendarView } from "@/components/calendar/CalendarView";
import { GanttChartView } from "@/components/gantt/GanttChartView";

export default function Home() {
    const [activeView, setActiveView] = React.useState("kanban");

    return (
        <div className="flex min-h-screen">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />

            <main className="flex-1 lg:ml-64 p-8 transition-all">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">
                        {activeView === "kanban" && "看板"}
                        {activeView === "gantt" && "甘特圖"}
                        {activeView === "calendar" && "月曆"}
                        {activeView === "settings" && "設定"}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {activeView === "kanban" && "透過卡片與清單視覺化管理您的任務。"}
                        {activeView === "gantt" && "追蹤專案時間軸與相依性。"}
                        {activeView === "calendar" && "在月曆上查看您的任務時程。"}
                        {activeView === "settings" && "配置專案設定與工作流。"}
                    </p>
                </header>

                {/* View Content */}
                <div className="flex-1 h-[calc(100vh-180px)] overflow-hidden">
                    {activeView === "kanban" && <KanbanBoard />}

                    {activeView === "gantt" && <GanttChartView />}

                    {activeView === "calendar" && <CalendarView />}

                    {activeView === "settings" && (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-full flex items-center justify-center">
                            <p className="text-slate-400 font-medium">設定模組開發中</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
