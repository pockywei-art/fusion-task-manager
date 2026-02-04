export type UserRole = 'admin' | 'member' | 'guest';

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    updated_at: string;
}

export interface Board {
    id: string;
    title: string;
    description: string | null;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface List {
    id: string;
    board_id: string;
    title: string;
    position: number;
    created_at: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    list_id: string;
    title: string;
    description: string | null;
    position: number;
    start_date: string | null;
    end_date: string | null;
    assignee_id: string | null;
    priority: Priority;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: string;
    task_id: string | null;
    user_id: string | null;
    action: string;
    metadata: Record<string, unknown>;
    created_at: string;
}

// 模擬看板數據結構
export interface KanbanData {
    board: Board;
    lists: (List & { tasks: Task[] })[];
}
