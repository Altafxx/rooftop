import { NavItem } from '@/types';

export type Product = {
    name: string;
    description: string;
    created_at: string;
    price: number;
    id: number;
    category: string;
    updated_at: string;
};

export type TaskState = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';

export type Task = {
    title: string
    description: string | null
    due_date: string | null
    id: number
    state: TaskState
    completed_at: string | null
    created_at: string
    updated_at: string
    blockers: number[]
    dependents: number[]
}

export type TaskCreate = {
    title: string
    description?: string | null
    due_date?: string | null
    state?: TaskState | null
}

export type TaskUpdate = {
    title?: string | null
    description?: string | null
    due_date?: string | null
    state?: TaskState | null
}

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
    {
        title: 'Task',
        url: '/dashboard/tasks',
        icon: 'kanban',
        shortcut: ['t', 't'],
        isActive: false,
        items: [] // No child items
    },
    {
        title: 'Products',
        url: '/dashboard/product',
        icon: 'product',
        shortcut: ['p', 'p'],
        isActive: false,
        items: [] // No child items
    },
    {
        title: 'Account',
        url: '#', // Placeholder as there is no direct link for the parent
        icon: 'billing',
        isActive: true,

        items: [
            {
                title: 'Profile',
                url: '/dashboard/profile',
                icon: 'userPen',
                shortcut: ['m', 'm']
            },
        ]
    }
];