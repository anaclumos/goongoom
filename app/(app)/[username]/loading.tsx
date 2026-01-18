import { MainContent } from "@/components/layout/main-content";
import { RightPanel } from "@/components/layout/right-panel";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <>
      <MainContent>
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-4 w-full max-w-md mb-2" />
              <Skeleton className="h-4 w-2/3 max-w-md" />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
          ))}
        </div>
      </MainContent>
      
      <RightPanel>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-32 w-full rounded-lg mb-4" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </RightPanel>
    </>
  );
}
