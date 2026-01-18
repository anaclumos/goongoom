import { QuestionBubble } from "@/components/questions/QuestionBubble";
import { AnswerBubble } from "@/components/questions/AnswerBubble";

const qaData = [
  {
    question: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous1",
      content: "개발자로 일하면서 가장 보람찬 순간은 언제인가요?",
      isAnonymous: true,
      timestamp: "5시간 전",
    },
    answer: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juno",
      username: "주노",
      content: "처음 만든 서비스가 실제 사용자들에게 도움이 되었을 때입니다. 특히 사용자들의 긍정적인 피드백을 받았을 때 정말 뿌듯했어요.",
      timestamp: "5시간 전",
    },
  },
  {
    question: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous2",
      content: "요즘 어떤 기술 스택을 공부하고 계신가요?",
      isAnonymous: true,
      timestamp: "1일 전",
    },
    answer: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juno",
      username: "주노",
      content: "Next.js 16과 React 19를 주로 공부하고 있어요. 서버 컴포넌트와 새로운 훅들이 정말 흥미롭더라고요!",
      timestamp: "1일 전",
    },
  },
  {
    question: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous3",
      content: "프로그래밍을 처음 시작하는 사람에게 조언 한마디 해주신다면?",
      isAnonymous: true,
      timestamp: "2일 전",
    },
    answer: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juno",
      username: "주노",
      content: "작은 프로젝트부터 시작해서 직접 만들어보는 게 가장 중요해요. 튜토리얼만 따라하지 말고 자신만의 아이디어를 구현해보세요!",
      timestamp: "2일 전",
    },
  },
];

export function QAFeed() {
  return (
    <div className="space-y-6">
      {qaData.map((qa) => (
        <div key={qa.question.content} className="space-y-4">
          <QuestionBubble {...qa.question} />
          <AnswerBubble {...qa.answer} />
        </div>
      ))}
    </div>
  );
}
