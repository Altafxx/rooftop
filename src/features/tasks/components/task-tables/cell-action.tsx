'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { TaskModal } from '@/components/modal/task-modal';
import { DependencyModal } from '../dependency-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Task } from '@/constants/data';
import { deleteTask } from '@/actions/tasks';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { Link } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useTaskLoading } from '../../contexts/task-loading-context';

interface CellActionProps {
    data: Task;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [dependencyModalOpen, setDependencyModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { setTaskLoading } = useTaskLoading();

    const onConfirm = async () => {
        setTaskLoading(data.id, true);
        startTransition(async () => {
            try {
                await deleteTask(data.id);
                toast.success('Task deleted successfully');
                setDeleteModalOpen(false);
            } catch (error) {
                toast.error('Failed to delete task');
                console.error('Error deleting task:', error);
            } finally {
                setTaskLoading(data.id, false);
            }
        });
    };

    return (
        <>
            <AlertModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={onConfirm}
                loading={isPending}
            />

            <TaskModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                task={data}
            />

            <DependencyModal
                isOpen={dependencyModalOpen}
                onClose={() => setDependencyModalOpen(false)}
                task={data}
            />

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <IconDotsVertical className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => setEditModalOpen(true)}
                    >
                        <IconEdit className='mr-2 h-4 w-4' /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setDependencyModalOpen(true)}
                    >
                        <Link className='mr-2 h-4 w-4' /> Dependencies
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
                        <IconTrash className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
