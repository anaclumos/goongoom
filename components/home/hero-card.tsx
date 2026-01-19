import { Card } from "@/components/ui/card";

export function HeroCard() {
  return (
    <Card className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-12 mb-8 overflow-hidden border-orange-500">
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'var(--pattern-grid)' }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          궁금한 게 있으신가요?
        </h1>
        <p className="text-xl text-white/90">익명으로 물어보세요</p>
      </div>
    </Card>
  );
}
