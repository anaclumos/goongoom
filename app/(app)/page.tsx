import { MainContent } from "@/components/layout/main-content";
import { RightPanel } from "@/components/layout/right-panel";
import { HeroCard } from "@/components/home/hero-card";
import { QAFeed } from "@/components/home/qa-feed";
import { PeopleList } from "@/components/home/people-list";
import { getRecentAnsweredQuestions } from "@/lib/db/queries";
import { getClerkUsersByIds } from "@/lib/clerk";

export default async function HomePage() {
  const recentQA = await getRecentAnsweredQuestions(10);
  
  const clerkIds = [...new Set(recentQA.map(qa => qa.recipientClerkId))];
  const clerkUsersMap = await getClerkUsersByIds(clerkIds);
  
  const enrichedQA = recentQA.map(qa => ({
    ...qa,
    recipientInfo: clerkUsersMap.get(qa.recipientClerkId) || undefined,
  }));
  
  return (
    <>
      <MainContent>
        <HeroCard />
        <QAFeed recentItems={enrichedQA} />
      </MainContent>
      
      <RightPanel>
        <PeopleList />
      </RightPanel>
    </>
  );
}
