import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { MainContent } from "@/components/layout/main-content";
import { ProfileHeader } from "@/components/profile/profile-header";
import { QuestionForm } from "@/components/profile/question-form";
import { QAFeed } from "@/components/home/qa-feed";
import { getClerkUserByUsername } from "@/lib/clerk";
import { getOrCreateUser, getUserWithAnsweredQuestions } from "@/lib/db/queries";
import type { QuestionWithAnswers } from "@/lib/types";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UserProfilePage({
  params,
  searchParams,
}: UserProfilePageProps) {
  const { username } = await params;
  const [clerkUser, authResult, query] = await Promise.all([
    getClerkUserByUsername(username),
    auth(),
    searchParams,
  ]);

  if (!clerkUser) notFound();

  const [dbUser, { answeredQuestions }] = await Promise.all([
    getOrCreateUser(clerkUser.clerkId),
    getUserWithAnsweredQuestions(clerkUser.clerkId),
  ]);

  const displayName = clerkUser.displayName || clerkUser.username || username;
  const { userId } = authResult;

  const error =
    typeof query?.error === "string" ? decodeURIComponent(query.error) : null;
  const sent = query?.sent === "1";
  const status = error
    ? { type: "error" as const, message: error }
    : sent
      ? { type: "success" as const, message: "질문이 전송되었습니다!" }
      : null;

  return (
    <MainContent>
      <ProfileHeader
        avatar={clerkUser.avatarUrl}
        name={displayName}
        username={clerkUser.username || username}
        bio={dbUser?.bio || undefined}
        socialLinks={dbUser?.socialLinks || undefined}
      />
      <QuestionForm
        recipientClerkId={clerkUser.clerkId}
        recipientUsername={clerkUser.username || username}
        questionSecurityLevel={dbUser?.questionSecurityLevel || null}
        viewerIsVerified={Boolean(userId)}
        status={status}
      />
      <QAFeed
        items={answeredQuestions as QuestionWithAnswers[]}
        recipientName={displayName}
        recipientAvatar={clerkUser.avatarUrl}
      />
    </MainContent>
  );
}
