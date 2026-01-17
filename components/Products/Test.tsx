import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaCheck, FaArrowRight, FaStar, FaTimes } from "react-icons/fa";
import Image from "next/image";
import ReactConfetti from "react-confetti";
import PersonalReport from "./PersonalReport";
import Advertisement from "./Advertisement";
import { useAuth } from "@/components/AuthContext";
import LoginPopup from "@/components/LoginPopup";
import { testResultsService } from "@/lib/testResultsService";
import { useRouter } from "next/navigation";

async function getDietPlanResults({
  prompt,
  dietPlanName,
}: {
  prompt: { question: string; answer: string }[];
  dietPlanName: string;
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      testName: dietPlanName,
    }),
  });
  const data = await response.json();
  return data;
}

export default function DietPlan({
  setTest,
  test,
}: {
  setTest: Function;
  test: any;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any>([]);
  const [selected, setSelected] = useState<any>([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    null | "success" | "error" | "saving"
  >(null);
  const router = useRouter();

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 'E' key to jump to last question
      if (
        event.key.toLowerCase() === "e" &&
        test &&
        test.questions &&
        currentIndex < test.questions.length - 1
      ) {
        setCurrentIndex(test.questions.length - 1);
      }

      // 'Escape' key to close diet plan
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentIndex, test]);

  const handleClose = () => {
    setTest(false);
    setUserAnswers([]);
    setSelected([]);
    setCurrentIndex(0);
    setFinished(false);
    setShouldAnimate(false);
    setResults(null);
  };

  useEffect(() => {
    if (currentIndex === test?.questions?.length) {
      setLoading(true);

      const fetchResults = async () => {
        const results = await getDietPlanResults({
          prompt: selected,
          dietPlanName: test?.title,
        });
        console.log("Diet Plan Results:", results);
        setResults(results);
      };

      fetchResults()
        .catch((err) => console.error(err))
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
  }, [currentIndex, test?.questions?.length, selected]);

  // Save diet plan result handler
  const handleSaveResult = async () => {
    if (!results) return;
    setSaveStatus("saving");
    try {
      await testResultsService.saveTestResult({
        userId: user?.id || null,
        testName: test?.title,
        answers: selected,
        report: results,
      });
      setSaveStatus("success");
    } catch (e) {
      setSaveStatus("error");
    }
  };

  // If user logs in after diet plan, auto-save
  useEffect(() => {
    if (user && showLogin && results && saveStatus !== "success") {
      handleSaveResult();
      setShowLogin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, showLogin, results]);

  // Redirect to dashboard after successful save if logged in
  useEffect(() => {
    if (saveStatus === "success" && user) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200); // short delay to show confirmation
    }
  }, [saveStatus, user, router]);

  return (
    <div className="z-50 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl flex flex-col">
      {/* Diet Plan Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        {/* Confetti Animation */}
        {shouldAnimate && (
          <div
            className={`absolute inset-0 ${
              shouldAnimate ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300 z-10`}
          >
            <ReactConfetti width={1920} height={1920} />
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-4 lg:p-8 text-center relative overflow-hidden flex-shrink-0">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            aria-label="Zamknij plan dietetyczny"
          >
            <FaTimes className="text-white text-lg" />
          </button>

          <div className="relative z-10">
            {!results && (
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl lg:text-3xl xl:text-4xl font-bold mb-4 pr-12"
              >
                {test?.title}
              </motion.h1>
            )}

            {!finished && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-sm">
                  <FaPlay className="text-xs" />
                  <span className="font-medium">
                    Pytanie {currentIndex + 1} z {test?.questions?.length}
                  </span>
                </div>

                {test &&
                  test.questions &&
                  currentIndex < test.questions.length - 1 && (
                    <div className="text-white/80 text-xs lg:text-sm">
                      Naciśnij{" "}
                      <span className="bg-white/20 px-2 py-1 rounded font-mono">
                        E
                      </span>{" "}
                      aby przejść do ostatniego pytania
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {!finished && (
          <div className="px-4 lg:px-8 pt-4 flex-shrink-0">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentIndex + 1) / test?.questions?.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col p-4 lg:p-8 overflow-y-scroll h-[70vh]">
          {test && (
            <div className="relative">
              <AnimatePresence mode="wait">
                {test && test.questions[currentIndex] && (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 lg:space-y-6"
                  >
                    {/* Question */}
                    <div className="text-center">
                      <h2 className="text-base lg:text-xl xl:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 leading-relaxed">
                        {test.questions[currentIndex].question}
                      </h2>
                    </div>

                    {/* Answers */}
                    <div className="space-y-3 lg:space-y-4">
                      {test.questions[currentIndex].answers.map(
                        (answer: string, i: number) => {
                          const isSelected = selected.some(
                            (item: any) =>
                              item.question ===
                                test.questions[currentIndex].question &&
                              item.answer === answer
                          );

                          return (
                            <motion.button
                              key={i}
                              onClick={() => {
                                setSelected((prev: any) => {
                                  const isAlreadySelected = prev.some(
                                    (item: any) =>
                                      item.question ===
                                        test.questions[currentIndex].question &&
                                      item.answer === answer
                                  );
                                  if (isAlreadySelected) {
                                    return prev.filter(
                                      (item: any) =>
                                        !(
                                          item.question ===
                                            test.questions[currentIndex]
                                              .question &&
                                          item.answer === answer
                                        )
                                    );
                                  } else {
                                    return [
                                      ...prev.filter(
                                        (item: any) =>
                                          item.question !==
                                          test.questions[currentIndex].question
                                      ),
                                      {
                                        question:
                                          test.questions[currentIndex].question,
                                        answer,
                                      },
                                    ];
                                  }
                                });
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-3 lg:p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                                isSelected
                                  ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg"
                                  : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center space-x-3 lg:space-x-4">
                                <div
                                  className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-sm lg:text-lg ${
                                    isSelected
                                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}{" "}
                                  {/* A, B, C, D */}
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
                        }
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              {!finished && (
                <div className="mt-6 lg:mt-8 text-center">
                  <motion.button
                    onClick={() => {
                      setCurrentIndex((prev) =>
                        Math.min(prev + 1, test.questions.length)
                      );
                    }}
                    disabled={currentIndex + 1 !== selected.length}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center space-x-2 px-4 lg:px-8 py-3 lg:py-4 rounded-full font-semibold transition-all duration-300 text-sm lg:text-base ${
                      currentIndex + 1 === selected.length
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <span>Następne pytanie</span>
                    <FaArrowRight />
                  </motion.button>
                </div>
              )}

              {/* Completion State */}
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
                    Plan dietetyczny ukończony!
                  </h3>
                  <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">
                    Dziękujemy za wypełnienie ankiety. Generujemy Twój
                    spersonalizowany plan dietetyczny...
                  </p>

                  {loading && (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 lg:w-16 lg:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3 lg:mb-4"></div>
                      <p className="text-gray-600 text-sm lg:text-base">
                        Analizujemy Twoje preferencje...
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Results */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-6"
                >
                  <Advertisement />
                  <PersonalReport data={results} />
                  <div className="mt-6 flex flex-col items-center gap-4">
                    {!user ? (
                      <>
                        <button
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                          onClick={() => setShowLogin(true)}
                          disabled={saveStatus === "saving"}
                        >
                          Zaloguj i zapisz plan
                        </button>
                        <LoginPopup
                          isOpen={showLogin}
                          onClose={() => setShowLogin(false)}
                        />
                      </>
                    ) : (
                      <button
                        className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                        onClick={handleSaveResult}
                        disabled={
                          saveStatus === "saving" || saveStatus === "success"
                        }
                      >
                        {saveStatus === "saving"
                          ? "Zapisywanie..."
                          : saveStatus === "success"
                          ? "Plan zapisany!"
                          : "Zapisz plan"}
                      </button>
                    )}
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 lg:px-8 py-3 lg:py-4 flex-shrink-0 text-center relative z-40">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-300 text-sm lg:text-base"
          >
            Zamknij plan dietetyczny
          </button>
        </div>
      </motion.div>
    </div>
  );
}
