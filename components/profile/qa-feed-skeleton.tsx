import { Card, CardPanel } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function ChatPairSkeleton() {
  return (
    <Card>
      <CardPanel className="flex flex-col gap-4">
        {/* Question Bubble Skeleton */}
        <div className="flex w-full items-start gap-3">
          <Skeleton className="size-10 flex-shrink-0 rounded-full" />
          <div className="flex-1">
            <Card className="max-w-prose bg-muted/40 px-4 py-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </Card>
            <Skeleton className="mt-1 ml-1 h-3 w-24" />
          </div>
        </div>

        <Separator />

        {/* Answer Bubble Skeleton */}
        <div className="flex w-full items-start justify-end gap-3">
          <div className="flex flex-1 flex-col items-end">
            <Card className="max-w-prose border-primary/20 bg-primary px-4 py-3">
              <Skeleton className="h-4 w-full bg-primary-foreground/20" />
              <Skeleton className="mt-2 h-4 w-2/3 bg-primary-foreground/20" />
            </Card>
            <div className="mt-1 mr-1 flex flex-col items-end gap-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <Skeleton className="size-10 flex-shrink-0 rounded-full" />
        </div>
      </CardPanel>
    </Card>
  );
}

export function QAFeedSkeleton() {
  return (
    <div className="space-y-6">
      <ChatPairSkeleton />
      <ChatPairSkeleton />
      <ChatPairSkeleton />
    </div>
  );
}
