'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/constants/data';
import { addBlocker, removeBlocker } from '@/actions/tasks';
import { Plus, X, Link, Users } from 'lucide-react';
import { toast } from 'sonner';

interface DependencyManagerProps {
    task: Task;
    allTasks?: Task[]; // Optional: for validation and suggestions
}

export const DependencyManager: React.FC<DependencyManagerProps> = ({
    task,
    allTasks = []
}) => {
    const [isPending, startTransition] = useTransition();
    const [newBlockerId, setNewBlockerId] = useState('');

    // Filter out current task and existing blockers for suggestions
    const availableTasks = allTasks.filter(t =>
        t.id !== task.id &&
        !task.blockers.includes(t.id) &&
        !task.dependents.includes(t.id) // Prevent circular dependencies
    );

    const handleAddBlocker = async () => {
        const blockerId = parseInt(newBlockerId);

        if (!blockerId || isNaN(blockerId)) {
            toast.error('Please enter a valid task ID');
            return;
        }

        if (blockerId === task.id) {
            toast.error('A task cannot block itself');
            return;
        }

        if (task.blockers.includes(blockerId)) {
            toast.error('This task is already a blocker');
            return;
        }

        // Check if this would create a circular dependency
        if (task.dependents.includes(blockerId)) {
            toast.error('Cannot add blocker: This would create a circular dependency');
            return;
        }

        startTransition(async () => {
            try {
                await addBlocker(task.id, blockerId);
                setNewBlockerId('');
                toast.success(`Task #${blockerId} added as blocker`);
            } catch (error) {
                toast.error('Failed to add blocker');
                console.error('Error adding blocker:', error);
            }
        });
    };

    const handleRemoveBlocker = async (blockerId: number) => {
        startTransition(async () => {
            try {
                await removeBlocker(task.id, blockerId);
                toast.success(`Task #${blockerId} removed as blocker`);
            } catch (error) {
                toast.error('Failed to remove blocker');
                console.error('Error removing blocker:', error);
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Current Blockers */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                        <Link className="h-4 w-4" />
                        Blockers ({Math.max(0, task.blockers?.length || 0)})
                    </CardTitle>
                    <CardDescription>
                        Tasks that must be completed before this task can proceed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {(task.blockers?.length || 0) === 0 ? (
                        <p className="text-sm text-muted-foreground">No blockers</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {(task.blockers || []).map((blockerId) => {
                                const blockerTask = allTasks.find(t => t.id === blockerId);
                                return (
                                    <Badge
                                        key={blockerId}
                                        variant="destructive"
                                        className="flex items-center gap-1"
                                    >
                                        #{blockerId}
                                        {blockerTask && (
                                            <span className="ml-1 max-w-[100px] truncate">
                                                {blockerTask.title}
                                            </span>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-auto p-0 ml-1 hover:bg-transparent"
                                            onClick={() => handleRemoveBlocker(blockerId)}
                                            disabled={isPending}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add New Blocker */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Add Blocker</CardTitle>
                    <CardDescription>
                        Enter the ID of a task that blocks this one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Label htmlFor="blocker-id" className="sr-only">
                                Blocker Task ID
                            </Label>
                            <Input
                                id="blocker-id"
                                type="number"
                                placeholder="Enter task ID"
                                value={newBlockerId}
                                onChange={(e) => setNewBlockerId(e.target.value)}
                                disabled={isPending}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddBlocker();
                                    }
                                }}
                            />
                        </div>
                        <Button
                            onClick={handleAddBlocker}
                            disabled={isPending || !newBlockerId}
                            size="sm"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Available Tasks Suggestions */}
                    {availableTasks.length > 0 && (
                        <div className="mt-3">
                            <Label className="text-xs text-muted-foreground">
                                Available tasks:
                            </Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {availableTasks.slice(0, 5).map((availableTask) => (
                                    <Button
                                        key={availableTask.id}
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => setNewBlockerId(availableTask.id.toString())}
                                        disabled={isPending}
                                    >
                                        #{availableTask.id} {availableTask.title.slice(0, 20)}
                                        {availableTask.title.length > 20 && '...'}
                                    </Button>
                                ))}
                                {availableTasks.length > 5 && (
                                    <span className="text-xs text-muted-foreground self-center">
                                        +{availableTasks.length - 5} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Current Dependents (Read-only) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        Dependents ({Math.max(0, task.dependents?.length || 0)})
                    </CardTitle>
                    <CardDescription>
                        Tasks that are blocked by this task
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {(task.dependents?.length || 0) === 0 ? (
                        <p className="text-sm text-muted-foreground">No dependents</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {(task.dependents || []).map((dependentId) => {
                                const dependentTask = allTasks.find(t => t.id === dependentId);
                                return (
                                    <Badge
                                        key={dependentId}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        #{dependentId}
                                        {dependentTask && (
                                            <span className="ml-1 max-w-[100px] truncate">
                                                {dependentTask.title}
                                            </span>
                                        )}
                                    </Badge>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
