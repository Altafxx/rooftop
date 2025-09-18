'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Product } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';

export const columns: ColumnDef<Product>[] = [
    {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }: { column: Column<Product, unknown> }) => (
            <DataTableColumnHeader column={column} title='Name' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Product['name']>()}</div>,
        meta: {
            label: 'Name',
            placeholder: 'Search products...',
            variant: 'text',
            icon: Text
        },
        enableColumnFilter: true
    },
    {
        id: 'category',
        accessorKey: 'category',
        header: ({ column }: { column: Column<Product, unknown> }) => (
            <DataTableColumnHeader column={column} title='Category' />
        ),
        cell: ({ cell }) => {
            const category = cell.getValue<Product['category']>();

            return (
                <Badge variant='outline' className='capitalize'>
                    {category}
                </Badge>
            );
        },
        enableColumnFilter: true,
        meta: {
            label: 'categories',
            variant: 'multiSelect',
            options: CATEGORY_OPTIONS
        }
    },
    {
        accessorKey: 'price',
        header: 'PRICE',
        cell: ({ cell }) => {
            const price = cell.getValue<Product['price']>();
            return <div>RM {price.toFixed(2)}</div>;
        }
    },
    {
        accessorKey: 'description',
        header: 'DESCRIPTION',
        cell: ({ cell }) => {
            const description = cell.getValue<Product['description']>();
            return (
                <div className='max-w-xs truncate' title={description}>
                    {description}
                </div>
            );
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
];
