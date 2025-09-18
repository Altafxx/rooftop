'use client';

import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { TaskLoadingProvider } from '../../contexts/task-loading-context';
import { TaskDataTable } from './task-data-table';
import { Task } from '@/constants/data';

interface TaskTableParams<TData extends Task, TValue> {
    data: TData[];
    totalItems: number;
    columns: ColumnDef<TData, TValue>[];
}
export function TaskTable<TData extends Task, TValue>({
    data,
    totalItems,
    columns
}: TaskTableParams<TData, TValue>) {
    const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

    const pageCount = Math.ceil(totalItems / pageSize);

    const { table } = useDataTable({
        data, // task data
        columns, // task columns
        pageCount: pageCount,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        debounceMs: 500
    });

    return (
        <TaskLoadingProvider>
            <TaskDataTable table={table}>
                <DataTableToolbar table={table} />
            </TaskDataTable>
        </TaskLoadingProvider>
    );
}
