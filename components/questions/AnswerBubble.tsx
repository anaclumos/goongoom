import Image from "next/image";

interface AnswerBubbleProps {
  avatar: string;
  username: string;
  content: string;
  timestamp: string;
}

export function AnswerBubble({
  avatar,
  username,
  content,
  timestamp,
}: AnswerBubbleProps) {
  return (
    <div className="flex gap-3 items-start justify-end">
      <div className="flex-1 flex flex-col items-end">
        <div className="bg-orange-500 text-white rounded-xl px-4 py-3 shadow-sm max-w-md">
          <p className="leading-relaxed">{content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 mr-1">
          {username} · {timestamp} 답변
        </p>
      </div>
      <Image
        src={avatar}
        alt={username}
        width={40}
        height={40}
        className="rounded-full flex-shrink-0"
      />
    </div>
  );
}
