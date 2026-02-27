"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { Course, IQuestion } from "@/types";
import { coursesService } from "@/lib/coursesService";
import { updateDocument } from "@/firebase";

export default function AddQuestionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  // Load all courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const allCourses = await coursesService.getAllCourses();
        setCourses(allCourses);
      } catch {
        setErrorMessage("Błąd podczas ładowania kursów");
      }
    };

    loadCourses();
  }, []);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setQuestions(course.questions || []);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answers: [""],
      },
    ]);
  };

  const updateQuestion = <K extends keyof IQuestion>(
    index: number,
    field: K,
    value: IQuestion[K]
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push("");
    setQuestions(updatedQuestions);
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSave = async () => {
    if (!selectedCourse) {
      setErrorMessage("Proszę wybrać kurs");
      return;
    }

    // Validate questions
    const validQuestions = questions.filter(
      (q) =>
        q.question.trim() !== "" &&
        q.answers.length > 0 &&
        q.answers.some((a) => a.trim() !== "")
    );

    if (validQuestions.length === 0) {
      setErrorMessage(
        "Proszę dodać przynajmniej jedno pytanie z odpowiedziami"
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateDocument(
        ["questions"],
        [validQuestions],
        "courses",
        selectedCourse.id
      );

      setSuccessMessage("Pytania zostały pomyślnie zapisane!");
      setTimeout(() => {
        router.push("/admin/courses/list");
      }, 2000);
    } catch {
      setErrorMessage("Wystąpił błąd podczas zapisywania pytań");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dodaj pytania do planu dietetycznego
          </h1>
          <button
            onClick={() => router.push("/admin/courses/list")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Powrót
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Course Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Wybierz plan dietetyczny
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCourse?.id === course.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <h3 className="font-semibold text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.category}</p>
                <p className="text-sm text-gray-500 mt-1">{course.price} PLN</p>
              </div>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Pytania dla: {selectedCourse.title}
              </h2>
              <button
                onClick={addQuestion}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <FaPlus />
                <span>Dodaj pytanie</span>
              </button>
            </div>

            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Brak pytań. Kliknij "Dodaj pytanie" aby rozpocząć.
              </p>
            ) : (
              <div className="space-y-6">
                {questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">
                        Pytanie {questionIndex + 1}
                      </h3>
                      <button
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pytanie
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(
                              questionIndex,
                              "question",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Wprowadź pytanie..."
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Odpowiedzi
                          </label>
                          <button
                            onClick={() => addAnswer(questionIndex)}
                            className="text-purple-600 hover:text-purple-700 text-sm"
                          >
                            + Dodaj odpowiedź
                          </button>
                        </div>
                        <div className="space-y-2">
                          {question?.answers?.map((answer, answerIndex) => (
                            <div
                              key={answerIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={answer}
                                onChange={(e) =>
                                  updateAnswer(
                                    questionIndex,
                                    answerIndex,
                                    e.target.value
                                  )
                                }
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder={`Odpowiedź ${answerIndex + 1}`}
                              />
                              {question.answers.length > 1 && (
                                <button
                                  onClick={() =>
                                    removeAnswer(questionIndex, answerIndex)
                                  }
                                  className="text-red-500 hover:text-red-700 p-2"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading || questions.length === 0}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FaSave />
                <span>{isLoading ? "Zapisywanie..." : "Zapisz pytania"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
