import { MainContent } from "@/components/layout/main-content";
import { Megaphone, Gift, Headset, Settings } from "lucide-react";

const moreOptions = [
  { icon: Megaphone, label: "공지사항" },
  { icon: Gift, label: "이벤트" },
  { icon: Headset, label: "문의하기" },
  { icon: Settings, label: "환경설정" },
];

export default function MorePage() {
  return (
    <MainContent>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">더보기</h1>
      
      <div className="space-y-4">
        {moreOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.label}
              type="button"
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <Icon className="w-6 h-6 text-gray-500" />
              <span className="text-lg text-gray-500">{option.label}</span>
            </button>
          );
        })}
      </div>
    </MainContent>
  );
}
