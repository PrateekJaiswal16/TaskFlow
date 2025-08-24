import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/useTaskStore';
import { useAuthStore } from '@/store/useAuthStore';

// Import necessary UI components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, FileText, ArrowLeft, User, Calendar, Edit, Trash2, CheckSquare } from 'lucide-react';
import TaskForm from '@/components/tasks/TaskForm';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedTask, loading, fetchTaskById, requestStatusChange, approveTask, deleteTask } = useTaskStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTaskById(id);
    }
  }, [id, fetchTaskById]);

  if (loading && !selectedTask) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!selectedTask) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Task not found or you're not authorized.</h2>
        <Link to="/dashboard"><Button variant="link">Go back to Dashboard</Button></Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteTask(selectedTask._id);
    navigate('/dashboard'); // Navigate away after deleting
  };

  return (
    <div className="container max-w-4xl py-8">
      <Link to="/dashboard" className="inline-flex items-center mb-6 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                <CardTitle className="text-3xl">{selectedTask.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                    <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>Assigned to <strong>{selectedTask.assignedTo.name}</strong></span></div>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Due: {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'N/A'}</span></div>
                </CardDescription>
                </div>
                <div className="flex items-center flex-shrink-0 gap-2">
                <Badge variant="outline">{selectedTask.status}</Badge>
                <Badge variant={selectedTask.priority === 'High' ? 'destructive' : 'secondary'}>{selectedTask.priority}</Badge>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <p className="mb-8 text-base text-muted-foreground">{selectedTask.description}</p>
          
          {selectedTask.attachedDocuments?.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">Attached Documents</h3>
              <ul className="space-y-2">
                {selectedTask.attachedDocuments.map(doc => (
                  <li key={doc.public_id}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 text-sm transition-colors border rounded-md hover:bg-muted">
                      <FileText className="w-4 h-4" />{doc.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-4 pt-6 mt-6 border-t">
          <div>
            {user?._id === selectedTask.assignedTo._id && selectedTask.status !== 'Pending Approval' && selectedTask.status !== 'Done' && (
                <Button onClick={() => requestStatusChange(selectedTask._id)}>
                    Request Status Change
                </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <>
                {selectedTask.status === 'Pending Approval' && (
                  <Button onClick={() => approveTask(selectedTask._id)} className="bg-green-600 hover:bg-green-700">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild><Button variant="outline"><Edit className="w-4 h-4 mr-2" />Edit</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
                    <TaskForm taskToEdit={selectedTask} onFinished={() => setIsEditDialogOpen(false)} />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task "{selectedTask.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}