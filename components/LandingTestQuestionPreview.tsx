import { FaPlay, FaTimes, FaArrowRight } from "react-icons/fa";

const previewAnswers = [
  "Schudnąć",
  "Zbudować masę",
  "Utrzymać wagę",
  "Poprawić energię",
];

export default function LandingTestQuestionPreview() {
  return (
    <div className="rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-zinc-600 via-gray-600 to-slate-600 px-5 py-4 text-white flex items-center justify-between">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
          Pytanie 1 z 9
          <FaPlay className="text-xs" />
        </div>
        <button
          type="button"
          aria-label="Podgląd testu"
          className="ml-4 rounded-full bg-white/20 p-2"
        >
          <FaTimes />
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <div className="h-2 rounded-full bg-zinc-200 mb-6 overflow-hidden">
          <div className="h-full w-[12%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#1f1d1d] text-center mb-6">
          Jaki jest Twój główny cel?
        </h3>

        <div className="space-y-3">
          {previewAnswers.map((answer, index) => (
            <div
              key={answer}
              className="w-full rounded-2xl border-2 border-zinc-200 bg-white px-4 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-700 font-bold flex items-center justify-center">
                {String.fromCharCode(65 + index)}
              </div>
              <p className="text-zinc-800 font-medium">{answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-200 px-6 py-3 text-zinc-600 font-semibold"
          >
            Następne pytanie
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
