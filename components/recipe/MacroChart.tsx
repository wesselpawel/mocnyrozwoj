"use client";

type MacroChartProps = {
  proteinG: number;
  fatG: number;
  carbsG: number;
  calories: number;
};

export default function MacroChart({ proteinG, fatG, carbsG, calories }: MacroChartProps) {
  const proteinCal = proteinG * 4;
  const fatCal = fatG * 9;
  const carbsCal = carbsG * 4;
  const total = proteinCal + fatCal + carbsCal;

  const proteinPercent = Math.round((proteinCal / total) * 100) || 0;
  const fatPercent = Math.round((fatCal / total) * 100) || 0;
  const carbsPercent = 100 - proteinPercent - fatPercent;

  const proteinDeg = (proteinPercent / 100) * 360;
  const fatDeg = (fatPercent / 100) * 360;

  const conicGradient = `conic-gradient(
    #ef4444 0deg ${proteinDeg}deg,
    #eab308 ${proteinDeg}deg ${proteinDeg + fatDeg}deg,
    #3b82f6 ${proteinDeg + fatDeg}deg 360deg
  )`;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h3 className="font-semibold text-zinc-800 mb-4 text-center">Rozkład makroskładników</h3>
      
      <div className="flex items-center justify-center gap-8">
        <div 
          className="w-32 h-32 rounded-full relative"
          style={{ background: conicGradient }}
        >
          <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-zinc-900">{calories}</div>
              <div className="text-xs text-zinc-500">kcal</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <div>
              <div className="text-sm font-medium text-zinc-700">Białko</div>
              <div className="text-xs text-zinc-500">{proteinG}g ({proteinPercent}%)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <div>
              <div className="text-sm font-medium text-zinc-700">Tłuszcze</div>
              <div className="text-xs text-zinc-500">{fatG}g ({fatPercent}%)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <div>
              <div className="text-sm font-medium text-zinc-700">Węglowodany</div>
              <div className="text-xs text-zinc-500">{carbsG}g ({carbsPercent}%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
