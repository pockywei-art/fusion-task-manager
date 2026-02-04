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

// Mock initial data
const INITIAL_LISTS: List[] = [
    { id: "list-1", board_id: "board-1", title: "To Do", position: 1, created_at: "" },
    { id: "list-2", board_id: "board-1", title: "In Progress", position: 2, created_at: "" },
    { id: "list-3", board_id: "board-1", title: "Completed", position: 3, created_at: "" },
];

const INITIAL_TASKS: Task[] = [
    { id: "task-1", list_id: "list-1", title: "Design System Implementation", description: "", position: 1, start_date: null, end_date: "2024-02-10", assignee_id: null, priority: "high", status: "todo", created_at: "", updated_at: "" },
    { id: "task-2", list_id: "list-1", title: "User Authentication Library", description: "", position: 2, start_date: null, end_date: "2024-02-12", assignee_id: null, priority: "medium", status: "todo", created_at: "", updated_at: "" },
    { id: "task-3", list_id: "list-2", title: "Kanban Drag & Drop Logic", description: "", position: 1, start_date: null, end_date: "2024-02-05", assignee_id: null, priority: "high", status: "doing", created_at: "", updated_at: "" },
];

export function KanbanBoard() {
    const [lists, setLists] = useState(INITIAL_LISTS);
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Avoid accidental drag on click
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

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // Implements dropping a task over another task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].list_id !== tasks[overIndex].list_id) {
                    const updatedTasks = [...tasks];
                    updatedTasks[activeIndex].list_id = tasks[overIndex].list_id;
                    return arrayMove(updatedTasks, activeIndex, overIndex);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        // Implements dropping a task over a column
        const isOverAColumn = over.data.current?.type === "Column";
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const updatedTasks = [...tasks];
                updatedTasks[activeIndex].list_id = overId as string;
                return arrayMove(updatedTasks, activeIndex, activeIndex);
            });
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveTask(null);
    }

    return (
        <div className="flex h-full overflow-x-auto gap-6 pb-6 scrollbar-hide">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex gap-6 items-start h-full">
                    {lists.map((list) => (
                        <Column
                            key={list.id}
                            list={list}
                            tasks={tasks.filter((t) => t.list_id === list.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <TaskCard task={activeTask} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
