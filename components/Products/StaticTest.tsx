"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaCheck,
  FaArrowRight,
  FaStar,
  FaTimes,
  FaVenus,
  FaMars,
} from "react-icons/fa";
import ReactConfetti from "react-confetti";
import PersonalReport from "./PersonalReport";
import { useAuth } from "@/components/AuthContext";
import LoginPopup from "@/components/LoginPopup";
import { testResultsService } from "@/lib/testResultsService";
import { useRouter } from "next/navigation";
import { IProduct, Diet, IQuestion } from "@/types";
import staticQuestions from "./staticQuestions.json";
import Image from "next/image";
import logoWhite from "@/public/logoNewWhite.png";
import { getDietPlanResultsStreamed } from "@/lib/testStreamClient";

export default function StaticTest({
  setTest,
  test,
  hideCloseButton = false,
  embeddedMode = false,
  autoSaveOnResult = false,
  redirectOnSaveSuccess = true,
  onAutoSaveSuccess,
}: {
  setTest: (value: IProduct | Diet | null) => void;
  test: IProduct | Diet | null;
  hideCloseButton?: boolean;
  embeddedMode?: boolean;
  autoSaveOnResult?: boolean;
  redirectOnSaveSuccess?: boolean;
  onAutoSaveSuccess?: (saved: {
    testName: string;
    createdAt: string;
    report: Record<string, unknown>;
    answers: { question: string; answer: string }[];
  }) => void;
}) {
  const loadingMessages = [
    "Tworzymy plan dietetyczny...",
    "Podliczamy kalorie...",
    "Tworzymy listę zakupów...",
    "Tworzymy przepisy...",
  ] as const;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<{ question: string; answer: string }[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [pendingSaveAfterLogin, setPendingSaveAfterLogin] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    null | "success" | "error" | "saving"
  >(null);
  const router = useRouter();
  const questions = staticQuestions as IQuestion[];
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const finishedRef = useRef(finished);
  const loadingRef = useRef(loading);
  const answeredRef = useRef(false);
  const hideCloseRef = useRef(hideCloseButton);
  finishedRef.current = finished;
  loadingRef.current = loading;
  hideCloseRef.current = hideCloseButton;
  const currentQuestion = questions[currentIndex];
  const isTextQuestion = currentQuestion?.type === "text";
  const isGenderQuestion = currentQuestion?.type === "gender";
  const isMultilineTextQuestion = isTextQuestion && !!currentQuestion?.multiline;
  const currentTextAnswerRaw = currentQuestion
    ? (
        selected.find((item) => item.question === currentQuestion.question)?.answer ?? ""
      )
    : "";
  const currentTextAnswer = currentTextAnswerRaw.trim();
  const hasAnsweredCurrentQuestion = !!currentQuestion
    ? isTextQuestion
      ? currentQuestion.optional
        ? true
        : currentTextAnswer.length > 0
      : selected.some((item) => item.question === currentQuestion.question)
    : false;
  answeredRef.current = hasAnsweredCurrentQuestion;
  const goToNextQuestion = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length));
  };

  const setTextAnswer = (questionText: string, answer: string) => {
    setSelected((prev) => [
      ...prev.filter((item) => item.question !== questionText),
      { question: questionText, answer },
    ]);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const pressedKey =
        typeof event.key === "string" ? event.key.toLowerCase() : "";
      if (
        pressedKey === "e" &&
        currentIndex < questions.length - 1
      ) {
        setCurrentIndex(questions.length - 1);
      }

      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !finishedRef.current &&
        !loadingRef.current &&
        currentIndex < questions.length &&
        answeredRef.current
      ) {
        const activeElement = document.activeElement as HTMLElement | null;
        if (
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA"
        ) {
          event.preventDefault();
        }
        goToNextQuestion();
      }

      if (!hideCloseRef.current && event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentIndex, questions.length]);

  const handleClose = () => {
    setTest(null);
    setSelected([]);
    setCurrentIndex(0);
    setFinished(false);
    setShouldAnimate(false);
    setResults(null);
    setSaveStatus(null);
    setShowLogin(false);
  };

  useEffect(() => {
    if (currentIndex === questions.length) {
      setLoading(true);

      const fetchResults = async () => {
        const report = await getDietPlanResultsStreamed({
          prompt: selected,
          dietPlanName: test?.title ?? "Plan dietetyczny",
        });
        setResults(report);
      };

      fetchResults()
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });

      setTimeout(() => {
        setShouldAnimate(true);
        setFinished(true);
      }, 500);
      setTimeout(() => {
        setShouldAnimate(false);
      }, 7000);
    }
  }, [currentIndex, questions.length, selected, test?.title]);

  const handleSaveResult = async () => {
    if (!results) return;
    setSaveStatus("saving");
    try {
      const createdAt = new Date().toISOString();
      const testName = test?.title ?? "Plan dietetyczny";
      await testResultsService.saveTestResult({
        userId: user?.id || null,
        testName,
        answers: selected,
        report: results,
      });
      setSaveStatus("success");
      if (onAutoSaveSuccess) {
        onAutoSaveSuccess({
          testName,
          createdAt,
          report: results,
          answers: selected,
        });
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const saveButtonLabel =
    saveStatus === "saving"
      ? "Zapisywanie..."
      : saveStatus === "success"
        ? "Plan zapisany!"
        : "Zapisz plan";

  useEffect(() => {
    if (
      user &&
      pendingSaveAfterLogin &&
      results &&
      saveStatus !== "success" &&
      saveStatus !== "saving"
    ) {
      handleSaveResult();
      setPendingSaveAfterLogin(false);
      setShowLogin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingSaveAfterLogin, results, saveStatus]);

  useEffect(() => {
    if (saveStatus === "success" && user && redirectOnSaveSuccess) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }
  }, [saveStatus, user, router, redirectOnSaveSuccess]);

  useEffect(() => {
    if (!loading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingMessageIndex((prev) => (prev < 3 ? prev + 1 : 3));
    }, 10000);

    return () => window.clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!finished && currentIndex < questions.length) {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [currentIndex, finished, questions.length]);

  useEffect(() => {
    if (
      autoSaveOnResult &&
      user &&
      results &&
      saveStatus !== "saving" &&
      saveStatus !== "success"
    ) {
      handleSaveResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveOnResult, user, results, saveStatus]);

  return (
    <div
      className={`z-50 w-full bg-white rounded-3xl flex flex-col ${
        embeddedMode ? "h-auto border border-[#e77503]/15 shadow-sm" : "h-full"
      }`}
    >
      <motion.div
        initial={embeddedMode ? false : { opacity: 0, y: 20 }}
        animate={embeddedMode ? { opacity: 1 } : { opacity: 1, y: 0 }}
        className={`${embeddedMode ? "h-auto" : "h-full"} flex flex-col`}
      >
        {shouldAnimate && (
          <div
            className={`absolute inset-0 ${
              shouldAnimate ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300 z-10`}
          >
            <ReactConfetti width={1920} height={1920} />
          </div>
        )}

        <div
          className={`bg-gradient-to-r from-zinc-600 via-gray-600 to-slate-600 text-white text-center relative overflow-hidden ${
            embeddedMode
              ? "sticky top-20 md:top-24 z-40 px-4 py-3"
              : "p-8"
          }`}
        >
        {finished && results && (
          <div className={`flex justify-center ${embeddedMode ? "" : "mb-2"}`}>
            <button
              className={`w-auto inline-flex justify-center items-center bg-[#e77503] text-white rounded-full font-bold shadow-lg hover:bg-[#e77503]/80 transition-all duration-300 disabled:opacity-80 ${
                embeddedMode ? "px-5 py-2.5 text-xl" : "px-6 py-3 text-base"
              }`}
              onClick={() => {
                if (saveStatus === "saving" || saveStatus === "success") return;
                if (user) {
                  handleSaveResult();
                  return;
                }
                setPendingSaveAfterLogin(true);
                setShowLogin(true);
              }}
              disabled={saveStatus === "saving" || saveStatus === "success"}
            >
              {saveButtonLabel}
            </button>
          </div>
        )}
          {!hideCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
              aria-label="Zamknij plan dietetyczny"
            >
              <FaTimes className="text-white text-lg" />
            </button>
          )}
          <div
            className={`z-10 ${
              embeddedMode
                ? "relative"
                : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            }`}
          >
        

            {!finished && (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-sm">
                  <span className="font-medium">
                    Pytanie {currentIndex + 1} z {questions.length}
                  </span>
                  <FaPlay className="text-xs" />
                </div>
              </div>
            )}
          </div>
        </div>

        {!finished && (
          <div className="px-4 lg:px-8 pt-4 flex-shrink-0">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className={`flex flex-col p-4 lg:p-8 ${
            embeddedMode
              ? ""
              : "flex-1 min-h-0 overflow-y-auto overscroll-contain"
          }`}
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {questions[currentIndex] && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h2 className="font-bold text-gray-800 mb-4 lg:mb-6 leading-relaxed">
                      {questions[currentIndex].question}
                    </h2>
                    {questions[currentIndex].multiple && (
                      <p className="text-sm text-gray-500 mb-4">
                        Możesz wybrać wiele odpowiedzi.
                      </p>
                    )}
                  </div>

                  {isTextQuestion && (
                    <div className="max-w-xl mx-auto">
                      <label
                        htmlFor={`question-input-${currentIndex}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Twoja odpowiedź
                        {currentQuestion.optional && (
                          <span className="ml-2 text-xs font-semibold text-zinc-500">
                            (opcjonalne)
                          </span>
                        )}
                      </label>
                      {isMultilineTextQuestion ? (
                        <>
                          <textarea
                            id={`question-input-${currentIndex}`}
                            value={currentTextAnswerRaw}
                            onChange={(event) =>
                              setTextAnswer(
                                currentQuestion.question,
                                event.target.value.slice(
                                  0,
                                  currentQuestion.maxLength ?? 100,
                                ),
                              )
                            }
                            placeholder={
                              currentQuestion.placeholder ?? "Wpisz odpowiedź"
                            }
                            maxLength={currentQuestion.maxLength ?? 100}
                            rows={4}
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-gray-800 focus:border-purple-500 focus:outline-none focus:ring-0 resize-none"
                          />
                          <p className="mt-1 text-xs text-zinc-500 text-right">
                            {currentTextAnswerRaw.length}/
                            {currentQuestion.maxLength ?? 100}
                          </p>
                        </>
                      ) : (
                        <input
                          id={`question-input-${currentIndex}`}
                          type={currentQuestion.inputType ?? "text"}
                          inputMode={
                            currentQuestion.inputType === "number"
                              ? "numeric"
                              : "text"
                          }
                          value={currentTextAnswerRaw}
                          onChange={(event) =>
                            setTextAnswer(currentQuestion.question, event.target.value)
                          }
                          placeholder={
                            currentQuestion.placeholder ?? "Wpisz odpowiedź"
                          }
                          className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-gray-800 focus:border-purple-500 focus:outline-none focus:ring-0"
                        />
                      )}
                    </div>
                  )}

                  {isGenderQuestion && (
                    <div className="max-w-xl mx-auto grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Kobieta",
                          icon: <FaVenus className="text-lg" />,
                          selectedClass:
                            "border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700",
                          idleClass: "border-gray-200 bg-white text-gray-700 hover:border-pink-300",
                        },
                        {
                          label: "Mężczyzna",
                          icon: <FaMars className="text-lg" />,
                          selectedClass:
                            "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700",
                          idleClass: "border-gray-200 bg-white text-gray-700 hover:border-blue-300",
                        },
                      ].map((option) => {
                        const isSelected = selected.some(
                          (item) =>
                            item.question === currentQuestion.question &&
                            item.answer === option.label,
                        );

                        return (
                          <motion.button
                            key={option.label}
                            onClick={() => {
                              setSelected((prev) => [
                                ...prev.filter(
                                  (item) => item.question !== currentQuestion.question,
                                ),
                                {
                                  question: currentQuestion.question,
                                  answer: option.label,
                                },
                              ]);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`rounded-2xl border-2 px-4 py-4 font-semibold transition-all duration-300 ${
                              isSelected ? option.selectedClass : option.idleClass
                            }`}
                          >
                            <span className="flex items-center justify-center gap-2">
                              {option.icon}
                              {option.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {!isTextQuestion && !isGenderQuestion && (
                    <div className="space-y-3 lg:space-y-4">
                      {(questions[currentIndex].answers ?? []).map((answer, i) => {
                      const isSelected = selected.some(
                        (item) =>
                          item.question === questions[currentIndex].question &&
                          item.answer === answer,
                      );

                      return (
                        <motion.button
                          key={i}
                          onClick={() => {
                            setSelected((prev) => {
                              const isAlreadySelected = prev.some(
                                (item) =>
                                  item.question === questions[currentIndex].question &&
                                  item.answer === answer,
                              );
                              if (isAlreadySelected) {
                                return prev.filter(
                                  (item) =>
                                    !(
                                      item.question === questions[currentIndex].question &&
                                      item.answer === answer
                                    ),
                                );
                              }
                              if (questions[currentIndex].multiple) {
                                return [
                                  ...prev,
                                  {
                                    question: questions[currentIndex].question,
                                    answer,
                                  },
                                ];
                              }
                              return [
                                ...prev.filter(
                                  (item) =>
                                    item.question !== questions[currentIndex].question,
                                ),
                                {
                                  question: questions[currentIndex].question,
                                  answer,
                                },
                              ];
                            });
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-3 rounded-2xl border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg"
                              : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center space-x-3 lg:space-x-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                isSelected
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium leading-relaxed text-sm lg:text-base">
                                {answer}
                              </p>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-purple-500"
                              >
                                <FaCheck />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!finished && (
              <div className="mt-6 lg:mt-8 text-center">
                <motion.button
                  onClick={goToNextQuestion}
                  disabled={!hasAnsweredCurrentQuestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center space-x-2 px-4 lg:px-8 py-3 lg:py-4 rounded-full font-semibold transition-all duration-300 text-sm lg:text-base ${
                    hasAnsweredCurrentQuestion
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>Następne pytanie</span>
                  <FaArrowRight />
                </motion.button>
              </div>
            )}

            {finished && !results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 lg:py-12"
              >
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                  <FaStar className="text-white text-xl lg:text-3xl" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">
                  Test ukończony!
                </h3>
                <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">
                Otrzymasz personalizowany plan dietetyczny...
                </p>

                {loading && (
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="mb-4 border-4 border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 shadow-md"
                      animate={{
                        width: [180, 120, 64, 64],
                        height: [32, 42, 64, 64],
                        borderRadius: ["0.75rem", "1rem", "9999px", "9999px"],
                        rotate: [0, 0, 0, 360],
                      }}
                      transition={{
                        duration: 3.2,
                        times: [0, 0.35, 0.65, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                    />
                    <p className="text-gray-600 text-sm lg:text-base">
                      {loadingMessages[loadingMessageIndex]}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {finished && results && !autoSaveOnResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className=""
              >
               

                <PersonalReport
                  data={results}
                  showShoppingList={false}
                  showRecipes={false}
                />
                <div className="mt-6 flex flex-col items-center gap-4">
                  <LoginPopup
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onDismissWithoutAuth={() =>
                      setPendingSaveAfterLogin(false)
                    }
                    skipDashboardRedirect
                    initialMode="register"
                    allowModeSwitch={false}
                  />
                  {saveStatus === "error" && (
                    <div className="text-red-600 font-medium">
                      Błąd podczas zapisywania planu. Spróbuj ponownie.
                    </div>
                  )}
                  {saveStatus === "success" && (
                    <div className="text-green-600 font-medium">
                      Plan został zapisany!
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {finished && results && autoSaveOnResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 lg:py-12"
              >
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                  <FaStar className="text-white text-xl lg:text-3xl" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">
                  Plan gotowy!
                </h3>
                <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">
                  Zapisujemy wynik i otwieramy Twój plan dnia...
                </p>
                {(saveStatus === "saving" || saveStatus === "success") && (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 lg:w-16 lg:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3 lg:mb-4"></div>
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="text-red-600 font-medium">
                    Błąd zapisu. Spróbuj ponownie.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
