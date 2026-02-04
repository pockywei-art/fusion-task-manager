"use client";

import React, { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { List, Task } from "@/types/database";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { useTasks } from "@/hooks/useTasks";

export function KanbanBoard() {
    const { lists, tasks, loading, addTask, updateTask, deleteTask, moveTask } = useTasks();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
        }
    }

    async function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

        if (!isActiveATask) return;

        if (isOverATask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
            const newListId = tasks[overIndex].list_id;

            // In a real app we'd recalculate positions for all tasks in the list
            // For now, we'll just update this task's list and position
            await moveTask(activeId, newListId, overIndex);
        }

        if (isOverAColumn) {
            await moveTask(activeId, overId, tasks.length);
        }
    }

    React.useEffect(() => {
        const handleGlobalAddTask = () => {
            if (lists.length > 0) {
                addTask(lists[0].id);
            }
        };

        window.addEventListener("addNewTask", handleGlobalAddTask);
        return () => window.removeEventListener("addNewTask", handleGlobalAddTask);
    }, [lists, addTask]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a9a5b]"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-x-auto gap-8 pb-6 scrollbar-hide">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="flex gap-8 items-start h-full">
                    {lists.map((list) => (
                        <Column
                            key={list.id}
                            list={list}
                            tasks={tasks.filter((t) => t.list_id === list.id)}
                            onAddTask={() => addTask(list.id)}
                            onTaskClick={setSelectedTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="rotate-3 shadow-2xl scale-105 transition-transform">
                            <TaskCard task={activeTask} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                />
            )}
        </div>
    );
}
