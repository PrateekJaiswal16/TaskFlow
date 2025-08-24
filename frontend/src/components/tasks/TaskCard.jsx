import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User } from "lucide-react";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function TaskCard({ task }) {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="flex flex-col justify-between transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        {/* Display both dates here */}
        <CardDescription className="text-xs">
          Assigned: {format(new Date(task.createdAt), 'PP')} | Due: {task.dueDate ? format(new Date(task.dueDate), 'PP') : 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{task.status}</Badge>
          <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t">
         <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{task.assignedTo.name}</span>
         </div>
         <div className="flex items-center gap-4">
            {task.attachedDocuments?.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{task.attachedDocuments.length}</span>
                </div>
            )}
            <Link to={`/tasks/${task._id}`}>
                <Button variant="ghost" size="sm">View Details</Button>
            </Link>
         </div>
      </CardFooter>
    </Card>
  );
}