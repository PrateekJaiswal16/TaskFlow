import { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TaskForm({ taskToEdit, onFinished }) {
  const { createTask, updateTask } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '', // Holds the user ID from the dropdown
    priority: 'Medium',
  });
  const [dueDate, setDueDate] = useState(null);
  const [files, setFiles] = useState([]);

  // Fetch the list of users when the form mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Pre-fill the form if a task is passed for editing
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        assignedTo: taskToEdit.assignedTo._id,
        priority: taskToEdit.priority,
      });
      if (taskToEdit.dueDate) {
        setDueDate(new Date(taskToEdit.dueDate));
      }
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      toast.error('You can only upload a maximum of 3 files.');
      e.target.value = null;
      return;
    }
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Construct the FormData object for the API call
    const data = new FormData();

    // 2. Find the selected user to get their email
    const selectedUser = users.find(user => user._id === formData.assignedTo);
    if (!selectedUser) {
      toast.error("Please select a user to assign the task to.");
      return;
    }
    
    // 3. Append all data fields to the FormData object
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('priority', formData.priority);
    data.append('assignedToEmail', selectedUser.email); // Send the email
    if (dueDate) {
      data.append('dueDate', dueDate.toISOString());
    }

    if (files.length > 0) {
      files.forEach(file => data.append('documents', file));
    }
    
    // 4. Call the appropriate store action
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, data);
      } else {
        await createTask(data);
      }
      onFinished(); // Close the parent dialog
    } catch (error) {
      // Errors are already handled by the service and store
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To</Label>
            <Select 
              value={formData.assignedTo} 
              onValueChange={(value) => setFormData({...formData, assignedTo: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user to assign" />
              </SelectTrigger>
              <SelectContent>
                {users.filter(user => user && user._id).map(user => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="documents">Attachments (Up to 3 PDFs)</Label>
            <Input id="documents" type="file" multiple accept=".pdf" onChange={handleFileChange} />
          </div>
          <Button className="w-full" type="submit">
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}