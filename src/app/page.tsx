"use client";

import React from "react";
import { BarChart2 } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CalendarView } from "@/components/calendar/CalendarView";
import { GanttChartView } from "@/components/gantt/GanttChartView";

export default function Home() {
    const [activeView, setActiveView] = React.useState("kanban");

    const handleNewTask = () => {
        if (activeView === "kanban") {
            // We can use a custom event or ref to trigger the KanbanBoard's internal add function
            const event = new CustomEvent("addNewTask");
            window.dispatchEvent(event);
        } else {
            setActiveView("kanban");
            // Delay slightly to allow view to switch before firing event
            setTimeout(() => {
                const event = new CustomEvent("addNewTask");
                window.dispatchEvent(event);
            }, 100);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fdfbfa]">
            <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                onNewTask={handleNewTask}
            />

            <main className="flex-1 lg:ml-64 p-8 transition-all">
                <header className="mb-10">
                    <h2 className="text-4xl font-extrabold text-[#4a3f35] tracking-tight">
                        {activeView === "kanban" && "專案看板"}
                        {activeView === "gantt" && "甘特圖進度"}
                        {activeView === "calendar" && "任務日曆"}
                        {activeView === "settings" && "環境設定"}
                    </h2>
                    <p className="text-[#a68b6d] mt-3 text-lg font-medium">
                        {activeView === "kanban" && "透過卡片與清單視覺化管理您的任務，流暢的拖放體驗。"}
                        {activeView === "gantt" && "追蹤專案時間軸與階段相依性，掌握全局進度。"}
                        {activeView === "calendar" && "在月曆上直觀地查看與管理您的任務時程。"}
                        {activeView === "settings" && "配置專案偏好設定與團隊工作流。"}
                    </p>
                </header>

                {/* View Content */}
                <div className="flex-1 h-[calc(100vh-200px)] overflow-hidden">
                    {activeView === "kanban" && <KanbanBoard />}

                    {activeView === "gantt" && <GanttChartView />}

                    {activeView === "calendar" && <CalendarView />}

                    {activeView === "settings" && (
                        <div className="bg-[#f1efe9]/50 border-2 border-dashed border-[#e8e3dd] rounded-3xl h-full flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-[#e8e3dd] rounded-2xl flex items-center justify-center text-[#a68b6d]">
                                <BarChart2 size={32} />
                            </div>
                            <p className="text-[#a68b6d] font-bold text-lg">設定模組開發中...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
