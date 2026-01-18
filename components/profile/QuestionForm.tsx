"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

interface QuestionFormProps {
  username: string;
}

export function QuestionForm({ username }: QuestionFormProps) {
  const [questionType, setQuestionType] = useState<"anonymous" | "public">("anonymous");
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUsername: username,
          content: question,
          isAnonymous: questionType === "anonymous",
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "질문 전송 실패");
      }
      
      setSuccess(true);
      setQuestion("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "질문 전송 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {username} 님에게 새 질문을 남겨보세요
      </h2>
      
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="질문을 입력하세요"
        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">누구로 질문할까요?</p>
        
        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="questionType"
            value="anonymous"
            checked={questionType === "anonymous"}
            onChange={(e) => setQuestionType(e.target.value as "anonymous")}
            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">익명</p>
            <p className="text-xs text-gray-500">익명으로 질문합니다</p>
          </div>
        </label>
        
        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="questionType"
            value="public"
            checked={questionType === "public"}
            onChange={(e) => setQuestionType(e.target.value as "public")}
            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">공개</p>
            <p className="text-xs text-gray-500">내 이름으로 질문합니다</p>
          </div>
        </label>
      </div>
      
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
          질문이 전송되었습니다!
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
          {error}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!question.trim() || isSubmitting}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          question.trim() && !isSubmitting ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"
        }`}
      >
        <Lock className="w-4 h-4" />
        {isSubmitting 
          ? "전송 중..." 
          : questionType === "anonymous" ? "익명으로 질문하기" : "공개로 질문하기"}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        질문 시 사용 약관에 동의하게 됩니다
      </p>
    </div>
  );
}
