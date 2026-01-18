import { Sidebar } from "@/components/layout/Sidebar";
import { MainContent } from "@/components/layout/MainContent";
import { RightPanel } from "@/components/layout/RightPanel";
import { HeroCard } from "@/components/home/HeroCard";
import { QAFeed } from "@/components/home/QAFeed";
import { PeopleList } from "@/components/home/PeopleList";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <MainContent>
        <HeroCard />
        <QAFeed />
      </MainContent>
      
      <RightPanel>
        <PeopleList />
      </RightPanel>
    </div>
  );
}
