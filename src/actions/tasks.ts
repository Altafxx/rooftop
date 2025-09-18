'use server';

import { Task, TaskCreate, TaskUpdate, TaskState } from "@/constants/data";
import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/config/env";



// Get all tasks
export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.status}`);
        }

        const data: Task[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Failed to fetch tasks');
    }
}

// Get a specific task by ID
export async function getTask(taskId: number): Promise<Task> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch task: ${response.status}`);
        }

        const data: Task = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching task:', error);
        throw new Error('Failed to fetch task');
    }
}

// Create a new task
export async function createTask(taskData: TaskCreate): Promise<Task> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create task: ${response.status}`);
        }

        const data: Task = await response.json();
        revalidatePath('/dashboard/tasks');
        return data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Failed to create task');
    }
}

// Update a task
export async function updateTask(taskId: number, taskData: TaskUpdate): Promise<Task> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update task: ${response.status}`);
        }

        const data: Task = await response.json();
        revalidatePath('/dashboard/tasks');
        revalidatePath(`/dashboard/tasks/${taskId}`);
        return data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error('Failed to update task');
    }
}

// Delete a task
export async function deleteTask(taskId: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.status}`);
        }

        revalidatePath('/dashboard/tasks');
    } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error('Failed to delete task');
    }
}

// Set task state
export async function setTaskState(taskId: number, state: TaskState): Promise<Task> {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/state/${state}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to set task state: ${response.status}`);
        }

        const data: Task = await response.json();
        revalidatePath('/dashboard/tasks');
        revalidatePath(`/dashboard/tasks/${taskId}`);
        return data;
    } catch (error) {
        console.error('Error setting task state:', error);
        throw new Error('Failed to set task state');
    }
}

// Add a blocker dependency
export async function addBlocker(taskId: number, blockerId: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/dependencies/${taskId}/blockers/${blockerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to add blocker: ${response.status}`);
        }

        revalidatePath('/dashboard/tasks');
        revalidatePath(`/dashboard/tasks/${taskId}`);
    } catch (error) {
        console.error('Error adding blocker:', error);
        throw new Error('Failed to add blocker');
    }
}

// Remove a blocker dependency
export async function removeBlocker(taskId: number, blockerId: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/dependencies/${taskId}/blockers/${blockerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to remove blocker: ${response.status}`);
        }

        revalidatePath('/dashboard/tasks');
        revalidatePath(`/dashboard/tasks/${taskId}`);
    } catch (error) {
        console.error('Error removing blocker:', error);
        throw new Error('Failed to remove blocker');
    }
}