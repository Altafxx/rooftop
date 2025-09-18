'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TaskLoadingContextType {
    loadingTasks: Set<number>;
    setTaskLoading: (taskId: number, isLoading: boolean) => void;
    isTaskLoading: (taskId: number) => boolean;
}

const TaskLoadingContext = createContext<TaskLoadingContextType | undefined>(undefined);

interface TaskLoadingProviderProps {
    children: ReactNode;
}

export const TaskLoadingProvider: React.FC<TaskLoadingProviderProps> = ({ children }) => {
    const [loadingTasks, setLoadingTasks] = useState<Set<number>>(new Set());

    const setTaskLoading = (taskId: number, isLoading: boolean) => {
        setLoadingTasks(prev => {
            const newSet = new Set(prev);
            if (isLoading) {
                newSet.add(taskId);
            } else {
                newSet.delete(taskId);
            }
            return newSet;
        });
    };

    const isTaskLoading = (taskId: number) => {
        return loadingTasks.has(taskId);
    };

    return (
        <TaskLoadingContext.Provider value={{ loadingTasks, setTaskLoading, isTaskLoading }}>
            {children}
        </TaskLoadingContext.Provider>
    );
};

export const useTaskLoading = () => {
    const context = useContext(TaskLoadingContext);
    if (context === undefined) {
        throw new Error('useTaskLoading must be used within a TaskLoadingProvider');
    }
    return context;
};
