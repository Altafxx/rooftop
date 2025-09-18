'use client';

import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useTaskLoading } from '../../contexts/task-loading-context';
import { Task } from '@/constants/data';
import { cn } from '@/lib/utils';

interface TaskDataTableProps<TData> extends React.ComponentProps<'div'> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
}

export function TaskDataTable<TData extends Task>({
    table,
    actionBar,
    children
}: TaskDataTableProps<TData>) {
    const { isTaskLoading } = useTaskLoading();

    return (
        <div className='flex flex-1 flex-col space-y-4'>
            {children}
            <div className='relative flex flex-1'>
                <div className='absolute inset-0 flex overflow-hidden rounded-lg border'>
                    <ScrollArea className='h-full w-full'>
                        <Table>
                            <TableHeader className='bg-muted sticky top-0 z-10'>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                style={{
                                                    ...getCommonPinningStyles({ column: header.column })
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => {
                                        const task = row.original as Task;
                                        const isLoading = isTaskLoading(task.id);
                                        
                                        return (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && 'selected'}
                                                className={cn(
                                                    'transition-all duration-200',
                                                    isLoading && 'opacity-50 bg-muted/30'
                                                )}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={{
                                                            ...getCommonPinningStyles({ column: cell.column })
                                                        }}
                                                        className={cn(
                                                            isLoading && 'pointer-events-none'
                                                        )}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={table.getAllColumns().length}
                                            className='h-24 text-center'
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation='horizontal' />
                    </ScrollArea>
                </div>
            </div>
            <div className='flex flex-col gap-2.5'>
                <DataTablePagination table={table} />
                {actionBar &&
                    table.getFilteredSelectedRowModel().rows.length > 0 &&
                    actionBar}
            </div>
        </div>
    );
}
