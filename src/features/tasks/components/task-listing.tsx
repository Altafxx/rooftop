import { TaskTable } from './task-tables';
import { columns } from './task-tables/columns';
import { getTasks } from '@/actions/tasks';

type TaskListingPageProps = Record<string, never>;

export default async function TaskListingPage({ }: TaskListingPageProps) {
    // Showcasing the use of search params cache in nested RSCs
    // const page = searchParamsCache.get('page');
    // const search = searchParamsCache.get('name'); // Using 'name' for title search
    // const pageLimit = searchParamsCache.get('perPage');
    // const states = searchParamsCache.get('category'); // Using 'category' for state filtering

    // For now, we'll get all tasks since the API doesn't support filtering
    // In a real implementation, you would pass these filters to the API
    // const filters = {
    //     page,
    //     limit: pageLimit,
    //     ...(search && { search }),
    //     ...(states && { states: states })
    // };

    const data = await getTasks();
    const totalTasks = data.length;

    return (
        <TaskTable
            data={data}
            totalItems={totalTasks}
            columns={columns}
        />
    );
}
