import { useState, useEffect, useCallback } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useAuthStore } from '@/store/useAuthStore';

// Import all necessary child components
import TaskForm from '@/components/tasks/TaskForm';
import TaskToolbar from '@/components/tasks/TaskToolbar';
import TaskCard from '@/components/tasks/TaskCard';
import TaskSkeleton from '@/components/tasks/TaskSkeleton';

// Import UI components from shadcn/ui and icons
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const { items, fetchTasks, loading, pagination } = useTaskStore();
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({ sortBy: 'createdAt', order: 'desc' });

  // Create a stable function for fetching tasks with filters and pagination
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchTasks({ page: 1, ...newFilters }); // Reset to page 1 when filters change
  }, [fetchTasks]);
  
  // Handler for when the page is changed
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchTasks({ page: newPage, ...filters });
    }
  };

  // Initial fetch of tasks when the component mounts
  useEffect(() => {
    fetchTasks({ page: 1, ...filters });
  }, [fetchTasks]);

  return (
    <div className="container py-8">
      <section className="space-y-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            {user?.role === 'admin' ? "All Tasks" : "Your Assigned Tasks"}
          </h2>
          
          {user?.role === 'admin' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a New Task</DialogTitle>
                </DialogHeader>
                <TaskForm onFinished={() => {
                    setIsDialogOpen(false);
                    fetchTasks({ page: 1, ...filters }); // Refetch tasks after creating one
                }} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* The TaskToolbar is now visible to all users */}
        <TaskToolbar onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <TaskSkeleton key={i} />)}
          </div>
        ) : !items.length ? (
          <div className="py-24 text-center rounded-lg border-2 border-dashed">
            <h3 className="text-lg font-semibold">No tasks found.</h3>
            <p className="text-sm text-muted-foreground">
              {user?.role === 'admin' ? "Click 'Create New Task' or adjust your filters." : "No tasks are currently assigned to you."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(t => <TaskCard key={t._id} task={t} />)}
            </div>

            {pagination.pages > 1 && (
              // src/pages/DashboardPage.jsx

              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  <PaginationItem>
                    <PaginationLink isActive>
                      {pagination.page}
                    </PaginationLink>
                  </PaginationItem>

                  {/* Add horizontal margin (mx-2) to this item */}
                  <PaginationItem>
                      <span className="mx-2 text-sm text-muted-foreground">of</span>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink>
                      {pagination.pages}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className={pagination.page === pagination.pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </section>
    </div>
  );
}