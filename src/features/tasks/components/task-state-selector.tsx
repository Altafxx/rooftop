'use client';

import { useState, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskState } from '@/constants/data';
import { setTaskState } from '@/actions/tasks';
import { toast } from 'sonner';
import { useTaskLoading } from '../contexts/task-loading-context';

interface TaskStateSelectorProps {
    task: Task;
}

const TASK_STATES: { value: TaskState; label: string }[] = [
    { value: 'BACKLOG', label: 'Backlog' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'BLOCKED', label: 'Blocked' },
    { value: 'DONE', label: 'Done' }
];

export const TaskStateSelector: React.FC<TaskStateSelectorProps> = ({ task }) => {
    const [isPending, startTransition] = useTransition();
    const [currentState, setCurrentState] = useState<TaskState>(task.state);
    const { setTaskLoading } = useTaskLoading();

    const handleStateChange = (newState: TaskState) => {
        if (newState === currentState) return;

        setCurrentState(newState);
        setTaskLoading(task.id, true);

        startTransition(async () => {
            try {
                await setTaskState(task.id, newState);
                toast.success(`Task state updated to ${TASK_STATES.find(s => s.value === newState)?.label}`);
            } catch (error) {
                // Revert the state on error
                setCurrentState(task.state);
                toast.error('Failed to update task state');
                console.error('Error updating task state:', error);
            } finally {
                setTaskLoading(task.id, false);
            }
        });
    };

    return (
        <Select
            value={currentState}
            onValueChange={handleStateChange}
            disabled={isPending}
        >
            <SelectTrigger className="w-[130px] h-8">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {TASK_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                        {state.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
