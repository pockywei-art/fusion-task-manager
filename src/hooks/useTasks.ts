"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Task, List } from '@/types/database';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data: listData } = await supabase
                .from('lists')
                .select('*')
                .order('position');

            const { data: taskData } = await supabase
                .from('tasks')
                .select('*')
                .order('position');

            if (listData) setLists(listData);
            if (taskData) setTasks(taskData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();

        // Subscribe to real-time changes
        const taskSubscription = supabase
            .channel('tasks-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
                fetchTasks();
            })
            .subscribe();

        const listSubscription = supabase
            .channel('lists-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lists' }, () => {
                fetchTasks();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(taskSubscription);
            supabase.removeChannel(listSubscription);
        };
    }, [fetchTasks]);

    const addTask = async (listId: string, title: string = "新任務名稱") => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                list_id: listId,
                title,
                position: tasks.length + 1,
                priority: 'medium',
                status: 'todo',
                assignee_id: user.id
            }])
            .select()
            .single();

        if (error) console.error('Error adding task:', error);
        return data;
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const { error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id);

        if (error) console.error('Error updating task:', error);
    };

    const deleteTask = async (id: string) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting task:', error);
    };

    const moveTask = async (taskId: string, newListId: string, newPosition: number) => {
        const { error } = await supabase
            .from('tasks')
            .update({
                list_id: newListId,
                position: newPosition,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId);

        if (error) console.error('Error moving task:', error);
    };

    return {
        tasks,
        lists,
        loading,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        refresh: fetchTasks
    };
}
