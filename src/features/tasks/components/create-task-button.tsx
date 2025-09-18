'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TaskModal } from '@/components/modal/task-modal';
import { IconPlus } from '@tabler/icons-react';

export const CreateTaskButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs md:text-sm"
            >
                <IconPlus className="mr-2 h-4 w-4" />
                Add New
            </Button>
            
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};
