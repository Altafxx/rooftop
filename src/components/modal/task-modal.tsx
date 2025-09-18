'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Task, TaskCreate, TaskUpdate, TaskState } from '@/constants/data';
import { createTask, updateTask } from '@/actions/tasks';
import { CalendarIcon, Link, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null; // If provided, we're editing; if null/undefined, we're creating
}

const TASK_STATES: { value: TaskState; label: string }[] = [
    { value: 'BACKLOG', label: 'Backlog' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'BLOCKED', label: 'Blocked' },
    { value: 'DONE', label: 'Done' }
];

export const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    task
}) => {
    const isEditing = !!task;
    const [isPending, startTransition] = useTransition();

    // Form state
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [state, setState] = useState<TaskState>(task?.state || 'TODO');
    const [dueDate, setDueDate] = useState<Date | undefined>(
        task?.due_date ? new Date(task.due_date) : undefined
    );

    // Sync form state when task prop changes
    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setState(task.state || 'TODO');
            setDueDate(task.due_date ? new Date(task.due_date) : undefined);
        } else {
            // Reset form for new task creation
            setTitle('');
            setDescription('');
            setState('TODO');
            setDueDate(undefined);
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        startTransition(async () => {
            try {
                if (isEditing && task) {
                    // Update existing task
                    const updateData: TaskUpdate = {
                        title: title.trim(),
                        description: description.trim() || null,
                        state,
                        due_date: dueDate ? dueDate.toISOString() : null
                    };

                    await updateTask(task.id, updateData);
                    toast.success('Task updated successfully');
                } else {
                    // Create new task
                    const createData: TaskCreate = {
                        title: title.trim(),
                        description: description.trim() || null,
                        state,
                        due_date: dueDate ? dueDate.toISOString() : null
                    };

                    await createTask(createData);
                    toast.success('Task created successfully');
                }

                onClose();
                resetForm();
            } catch (error) {
                toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
                console.error('Error saving task:', error);
            }
        });
    };

    const resetForm = () => {
        if (task) {
            // Reset to original task values when editing
            setTitle(task.title || '');
            setDescription(task.description || '');
            setState(task.state || 'TODO');
            setDueDate(task.due_date ? new Date(task.due_date) : undefined);
        } else {
            // Reset to empty values when creating
            setTitle('');
            setDescription('');
            setState('TODO');
            setDueDate(undefined);
        }
    };

    const handleClose = () => {
        onClose();
        // Always reset form on close to ensure clean state
        resetForm();
    };

    return (
        <Modal
            title={isEditing ? 'Edit Task' : 'Create New Task'}
            description={isEditing ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
            isOpen={isOpen}
            onClose={handleClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Field */}
                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        disabled={isPending}
                        required
                    />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description (optional)"
                        disabled={isPending}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        rows={3}
                    />
                </div>

                {/* State Field */}
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={state} onValueChange={(value: TaskState) => setState(value)} disabled={isPending}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select task state" />
                        </SelectTrigger>
                        <SelectContent>
                            {TASK_STATES.map((stateOption) => (
                                <SelectItem key={stateOption.value} value={stateOption.value}>
                                    {stateOption.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Due Date Field */}
                <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dueDate && "text-muted-foreground"
                                )}
                                disabled={isPending}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={setDueDate}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Dependencies Section (Read-only for editing tasks) */}
                {isEditing && task && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Blockers */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Link className="h-4 w-4" />
                                    Blockers ({Math.max(0, task.blockers?.length || 0)})
                                </Label>
                                <div className="min-h-[40px] p-2 border rounded-md bg-muted/50">
                                    {(task.blockers?.length || 0) === 0 ? (
                                        <span className="text-sm text-muted-foreground">None</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {(task.blockers || []).map((blockerId) => (
                                                <Badge key={blockerId} variant="destructive" className="text-xs">
                                                    #{blockerId}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dependents */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Dependents ({Math.max(0, task.dependents?.length || 0)})
                                </Label>
                                <div className="min-h-[40px] p-2 border rounded-md bg-muted/50">
                                    {(task.dependents?.length || 0) === 0 ? (
                                        <span className="text-sm text-muted-foreground">None</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {(task.dependents || []).map((dependentId) => (
                                                <Badge key={dependentId} variant="secondary" className="text-xs">
                                                    #{dependentId}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Use the &quot;Dependencies&quot; action in the task table to manage blockers and dependents.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending || !title.trim()}
                    >
                        {isPending ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
