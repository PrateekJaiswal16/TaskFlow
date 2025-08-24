import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/2 h-4 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="w-full h-4" />
        <div className="flex items-center pt-2 space-x-2">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}