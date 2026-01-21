"use client"

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs"
import {
  InboxIcon,
  Logout03Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

function ProfileDrawerContent() {
  const { user } = useUser()
  const profileHref = user?.username ? `/${user.username}` : "/settings"
  const displayName =
    user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress

  return (
    <>
      <DrawerHeader className="text-left">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 ring-2 ring-electric-blue/30">
            {user?.imageUrl ? (
              <AvatarImage alt={displayName || "Profile"} src={user.imageUrl} />
            ) : null}
            <AvatarFallback className="bg-muted text-lg">
              {displayName?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <DrawerTitle className="text-lg">{displayName}</DrawerTitle>
            {user?.username && (
              <DrawerDescription>@{user.username}</DrawerDescription>
            )}
          </div>
        </div>
      </DrawerHeader>

      <div className="flex flex-col gap-1 p-4 pt-2">
        <DrawerClose asChild>
          <Button
            className="h-12 w-full justify-start gap-3 px-4"
            render={<Link href={profileHref} />}
            variant="ghost"
          >
            <HugeiconsIcon className="size-5" icon={UserIcon} />
            <span className="font-medium">내 프로필</span>
          </Button>
        </DrawerClose>

        <DrawerClose asChild>
          <Button
            className="h-12 w-full justify-start gap-3 px-4"
            render={<Link href="/inbox" />}
            variant="ghost"
          >
            <HugeiconsIcon className="size-5" icon={InboxIcon} />
            <span className="font-medium">받은 질문함</span>
          </Button>
        </DrawerClose>

        <DrawerClose asChild>
          <Button
            className="h-12 w-full justify-start gap-3 px-4"
            render={<Link href="/settings" />}
            variant="ghost"
          >
            <HugeiconsIcon className="size-5" icon={Settings01Icon} />
            <span className="font-medium">설정</span>
          </Button>
        </DrawerClose>

        <Separator className="my-2" />

        <SignOutButton>
          <Button
            className="h-12 w-full justify-start gap-3 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
            variant="ghost"
          >
            <HugeiconsIcon className="size-5" icon={Logout03Icon} />
            <span className="font-medium">로그아웃</span>
          </Button>
        </SignOutButton>
      </div>
    </>
  )
}

function SignedOutContent() {
  return (
    <>
      <DrawerHeader className="text-center">
        <DrawerTitle className="text-xl">
          궁금닷컴에 오신 것을 환영합니다
        </DrawerTitle>
        <DrawerDescription>
          로그인하고 익명 질문을 주고받아 보세요
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-col gap-3 p-4">
        <SignInButton mode="modal">
          <Button className="h-12 w-full" size="lg" variant="outline">
            로그인
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="h-12 w-full" size="lg">
            시작하기
          </Button>
        </SignUpButton>
      </div>
    </>
  )
}

export function ProfileDrawer() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()

  return (
    <>
      <ClerkLoading>
        <Skeleton className="size-10 rounded-full" />
      </ClerkLoading>
      <ClerkLoaded>
        <Drawer onOpenChange={setOpen} open={open}>
          <button
            aria-label="프로필 메뉴 열기"
            className="tap-scale flex size-10 items-center justify-center rounded-full ring-2 ring-border/50 transition-all hover:ring-electric-blue/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
            onClick={() => setOpen(true)}
            type="button"
          >
            <SignedIn>
              <Avatar className="size-10">
                {user?.imageUrl ? (
                  <AvatarImage
                    alt={user.fullName || user.username || "Profile"}
                    src={user.imageUrl}
                  />
                ) : null}
                <AvatarFallback className="bg-muted text-sm">
                  {user?.fullName?.[0]?.toUpperCase() ||
                    user?.username?.[0]?.toUpperCase() ||
                    "?"}
                </AvatarFallback>
              </Avatar>
            </SignedIn>
            <SignedOut>
              <Avatar className="size-10">
                <AvatarFallback className="bg-muted">
                  <HugeiconsIcon
                    className="size-5 text-muted-foreground"
                    icon={UserIcon}
                  />
                </AvatarFallback>
              </Avatar>
            </SignedOut>
          </button>

          <DrawerContent className="pb-safe">
            <SignedIn>
              <ProfileDrawerContent />
            </SignedIn>
            <SignedOut>
              <SignedOutContent />
            </SignedOut>
          </DrawerContent>
        </Drawer>
      </ClerkLoaded>
    </>
  )
}
