import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from 'lucide-react';

export default function TaskToolbar({ onFilterChange }) {
  const { users, fetchUsers } = useUserStore();
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    sortBy: 'createdAt', // Default sort
    order: 'desc',
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleValueChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const defaultFilters = { status: '', priority: '', assignedTo: '', sortBy: 'createdAt', order: 'desc' };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters); // Fetch with default sort
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-card">
      {/* Filters */}
      <Select value={filters.assignedTo} onValueChange={(val) => handleValueChange('assignedTo', val)}>
        <SelectTrigger className="flex-1 min-w-[150px]"><SelectValue placeholder="Filter by user" /></SelectTrigger>
        <SelectContent>
            {users.filter(u => u && u._id).map(user => <SelectItem key={user._id} value={user._id}>{user.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(val) => handleValueChange('status', val)}>
         <SelectTrigger className="flex-1 min-w-[150px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
         <SelectContent>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
         </SelectContent>
      </Select>
      
      <Select value={filters.priority} onValueChange={(val) => handleValueChange('priority', val)}>
         <SelectTrigger className="flex-1 min-w-[150px]"><SelectValue placeholder="Filter by priority" /></SelectTrigger>
         <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
         </SelectContent>
      </Select>

      {/* Sorter */}
       <Select value={`${filters.sortBy}-${filters.order}`} onValueChange={(val) => {
            const [sortBy, order] = val.split('-');
            setFilters(prev => ({ ...prev, sortBy, order }));
       }}>
         <SelectTrigger className="flex-1 min-w-[150px] font-semibold"><SelectValue placeholder="Sort by" /></SelectTrigger>
         <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="dueDate-asc">Due Date (Asc)</SelectItem>
            <SelectItem value="priority-desc">Priority (High-Low)</SelectItem>
            <SelectItem value="status-asc">Status (A-Z)</SelectItem>
         </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button onClick={handleApplyFilters}><Filter className="w-4 h-4 mr-2" />Apply</Button>
        <Button variant="ghost" onClick={handleClearFilters}><X className="w-4 h-4 mr-2" />Clear</Button>
      </div>
    </div>
  );
}