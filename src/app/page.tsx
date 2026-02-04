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
                    <h2 className="text-3xl font-bold text-slate-900 capitalize">
                        {activeView.replace("-", " ")}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {activeView === "kanban" && "Manage your tasks visually with cards and lists."}
                        {activeView === "gantt" && "Track project timelines and dependencies."}
                        {activeView === "calendar" && "View your task schedule on a monthly calendar."}
                        {activeView === "settings" && "Configure project settings and workflows."}
                    </p>
                </header>

                {/* View Content */}
                <div className="flex-1 h-[calc(100vh-180px)] overflow-hidden">
                    {activeView === "kanban" && <KanbanBoard />}

                    {activeView === "gantt" && <GanttChartView />}

                    {activeView === "calendar" && <CalendarView />}

                    {activeView === "settings" && (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-full flex items-center justify-center">
                            <p className="text-slate-400 font-medium">Settings Module will be here</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
