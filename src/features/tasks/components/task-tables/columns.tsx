'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Task } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text, Calendar, Link, Users } from 'lucide-react';
import { CellAction } from './cell-action';
import { STATE_OPTIONS } from './options';
import { TaskStateSelector } from '../task-state-selector';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Task>[] = [
    {
        id: 'title',
        accessorKey: 'title',
        header: ({ column }: { column: Column<Task, unknown> }) => (
            <DataTableColumnHeader column={column} title='Title' />
        ),
        cell: ({ cell }) => <div className="font-medium">{cell.getValue<Task['title']>()}</div>,
        meta: {
            label: 'Title',
            placeholder: 'Search tasks...',
            variant: 'text',
            icon: Text
        },
        enableColumnFilter: true
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: ({ column }: { column: Column<Task, unknown> }) => (
            <DataTableColumnHeader column={column} title='Description' />
        ),
        cell: ({ cell }) => {
            const description = cell.getValue<Task['description']>();
            return (
                <div className="max-w-[300px] truncate" title={description || undefined}>
                    {description}
                </div>
            );
        },
        meta: {
            label: 'Description'
        }
    },
    {
        id: 'state',
        accessorKey: 'state',
        header: ({ column }: { column: Column<Task, unknown> }) => (
            <DataTableColumnHeader column={column} title='State' />
        ),
        cell: ({ row }) => {
            return <TaskStateSelector task={row.original} />;
        },
        enableColumnFilter: true,
        meta: {
            label: 'State',
            variant: 'multiSelect',
            options: STATE_OPTIONS
        }
    },
    {
        id: 'due_date',
        accessorKey: 'due_date',
        header: ({ column }: { column: Column<Task, unknown> }) => (
            <DataTableColumnHeader column={column} title='Due Date' />
        ),
        cell: ({ cell }) => {
            const dueDate = cell.getValue<Task['due_date']>();
            if (!dueDate) return <span className="text-muted-foreground">No due date</span>;

            const date = new Date(dueDate);
            const isOverdue = date < new Date() && cell.row.original.state !== 'DONE';

            return (
                <div className={`flex items-center ${isOverdue ? 'text-red-600' : ''}`}>
                    <Calendar className="mr-1 h-3 w-3" />
                    {date.toLocaleDateString()}
                </div>
            );
        },
        meta: {
            label: 'Due Date'
        }
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }: { column: Column<Task, unknown> }) => (
            <DataTableColumnHeader column={column} title='Created' />
        ),
        cell: ({ cell }) => {
            const createdAt = cell.getValue<Task['created_at']>();
            return new Date(createdAt).toLocaleDateString();
        },
        meta: {
            label: 'Created Date'
        }
    },
    {
        id: 'blockers',
        accessorKey: 'blockers',
        header: ({ column }: { column: Column<Task, unknown> }) => (
            <DataTableColumnHeader column={column} title='Blockers' />
        ),
        cell: ({ cell }) => {
            const blockers = cell.getValue<Task['blockers']>();
            if (!blockers || blockers.length === 0) {
                return <span className="text-muted-foreground">None</span>;
            }
            return (
                <div className="flex flex-wrap gap-1">
                    {blockers.map((blockerId) => (
                        <Badge key={blockerId} variant="destructive" className="text-xs">
                            <Link className="mr-1 h-3 w-3" />
                            #{blockerId}
                        </Badge>
                    ))}
                </div>
            );
        },
        meta: {
            label: 'Blockers'
        }
    },
    {
        id: 'dependents',
        accessorKey: 'dependents',
        header: ({ column }: { column: Column<Task, unknown> }) => (
            <DataTableColumnHeader column={column} title='Dependents' />
        ),
        cell: ({ cell }) => {
            const dependents = cell.getValue<Task['dependents']>();
            if (!dependents || dependents.length === 0) {
                return <span className="text-muted-foreground">None</span>;
            }
            return (
                <div className="flex flex-wrap gap-1">
                    {dependents.map((dependentId) => (
                        <Badge key={dependentId} variant="secondary" className="text-xs">
                            <Users className="mr-1 h-3 w-3" />
                            #{dependentId}
                        </Badge>
                    ))}
                </div>
            );
        },
        meta: {
            label: 'Dependents'
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
];
