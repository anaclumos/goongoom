import Image from "next/image";

interface QuestionBubbleProps {
  avatar: string;
  content: string;
  isAnonymous: boolean;
  timestamp: string;
}

export function QuestionBubble({
  avatar,
  content,
  isAnonymous,
  timestamp,
}: QuestionBubbleProps) {
  return (
    <div className="flex gap-3 items-start">
      <Image
        src={avatar}
        alt="Avatar"
        width={40}
        height={40}
        className="rounded-full flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
          <p className="text-gray-900 leading-relaxed">{content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-1">
          {isAnonymous ? "익명" : "공개"} · {timestamp} 질문
        </p>
      </div>
    </div>
  );
}
