import { Sidebar } from "@/components/layout/Sidebar";
import { MainContent } from "@/components/layout/MainContent";
import { RightPanel } from "@/components/layout/RightPanel";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { QuestionForm } from "@/components/profile/QuestionForm";
import { QAFeed } from "@/components/home/QAFeed";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params;
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <MainContent>
        <ProfileHeader
          avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=juno"
          name="주노"
          username={username}
          bio="웹 개발을 좋아하는 개발자입니다. 궁금한 것이 있으면 언제든 물어보세요!"
          socialLinks={{
            instagram: "https://instagram.com",
            facebook: "https://facebook.com",
            github: "https://github.com",
          }}
        />
        
        <QAFeed />
      </MainContent>
      
      <RightPanel>
        <QuestionForm username={username} />
      </RightPanel>
    </div>
  );
}
