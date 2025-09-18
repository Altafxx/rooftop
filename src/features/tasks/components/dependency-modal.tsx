'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Task } from '@/constants/data';
import { DependencyManager } from './dependency-manager';
import { getTasks } from '@/actions/tasks';

interface DependencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
}

export const DependencyModal: React.FC<DependencyModalProps> = ({
    isOpen,
    onClose,
    task
}) => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadTasks();
        }
    }, [isOpen]);

    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const tasks = await getTasks();
            setAllTasks(tasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={`Manage Dependencies - ${task.title}`}
            description="Add or remove task dependencies and blockers"
            isOpen={isOpen}
            onClose={onClose}
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">Loading tasks...</div>
                </div>
            ) : (
                <DependencyManager task={task} allTasks={allTasks} />
            )}
        </Modal>
    );
};
