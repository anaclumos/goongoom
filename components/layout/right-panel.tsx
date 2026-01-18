import type { ReactNode } from "react";

interface RightPanelProps {
  children: ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <aside className="hidden lg:block w-96 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        {children}
      </div>
    </aside>
  );
}
