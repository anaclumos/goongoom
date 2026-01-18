import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        {children}
      </div>
    </main>
  );
}
