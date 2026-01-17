"use client";

import React, { useState, useEffect } from "react";
import CourseCard from "../CourseCard";
import { useAuth } from "../AuthContext";
import LoginPopup from "../LoginPopup";
import { coursesService } from "@/lib/coursesService";
import { Course } from "@/types";

type PersonalityTrait = {
  trait: string;
  description: string;
};

type AreaForImprovement = {
  trait: string;
  description: string;
};

type PotentialChallenge = {
  challenge: string;
  solution: string;
};

type RecommendedResource = {
  type: string;
  title: string;
  author: string;
};

type EmotionalPotentialData = {
  summary?: {
    title: string;
    description: string;
  };
  strengths?: {
    personality_traits?: PersonalityTrait[];
    self_confidence?: string;
  };
  weaknesses?: {
    areas_for_improvement?: AreaForImprovement[];
    confidence_barriers?: string;
  };
  dream_alignment?: {
    compatibility?: string;
    potential_challenges?: PotentialChallenge[];
  };
  personalized_advice?: {
    self_improvement_tips?: string[];
    mindset_shift?: string;
  };
  next_steps?: {
    actionable_goals?: string[];
    recommended_resources?: RecommendedResource[];
  };
};

interface Props {
  data: EmotionalPotentialData;
}

const PersonalReport: React.FC<Props> = ({ data }) => {
  const { user } = useAuth();
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const courses = await coursesService.getVisibleCourses();
        // Take first 3 courses as recommended courses
        setRecommendedCourses(courses.slice(0, 3));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (course: Course) => {
    if (user) {
      // Check if user owns this course
      if (user?.purchasedCourses?.includes(course.id)) {
        // User owns the course, navigate to course content
        console.log("User owns course, navigating to content");
        // You can implement navigation to course content here
      } else {
        // User doesn't own the course, trigger purchase
        handlePurchase(course);
      }
    } else {
      setShowLoginPopup(true);
    }
  };

  const handlePurchase = async (course: Course) => {
    try {
      // Track begin checkout event
      const { trackBeginCheckout } = await import("@/lib/conversionTracking");
      trackBeginCheckout(course.price, "PLN", [
        {
          item_id: course.id,
          item_name: course.title,
          price: course.price,
          quantity: 1,
        },
      ]);

      // Create Stripe checkout session
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: course.id,
            courseTitle: course.title,
            coursePrice: course.price,
            userEmail: user?.email,
            userId: user?.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error("Error creating checkout session:", data.error);
      }
    } catch (error) {
      console.error("Error handling purchase:", error);
    }
  };

  if (!data) return <p>Brak danych</p>;

  return (
    <>
      <div className="text-left space-y-6 overflow-y-auto max-h-full pb-6">
        {data.summary && (
          <section className="text-center p-4 rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
              {data.summary.title}
            </h2>
            <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
              {data.summary.description}
            </p>
          </section>
        )}

        {data.strengths && (
          <section className="p-4 rounded-lg shadow-sm bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <h3 className="text-lg lg:text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mx-auto w-max max-w-full p-3 -mt-3 mb-4">
              Mocne Strony
            </h3>
            {data.strengths.personality_traits && (
              <ul className="space-y-3">
                {data.strengths.personality_traits.map((trait, index) => (
                  <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <strong className="text-white bg-green-500 px-2 py-1 rounded text-sm">
                      {trait.trait}:
                    </strong>{" "}
                    <span className="text-gray-700 text-sm lg:text-base">
                      {trait.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {data.strengths.self_confidence && (
              <p className="text-gray-700 text-sm lg:text-base bg-white p-3 rounded-lg shadow-sm">
                {data.strengths.self_confidence}
              </p>
            )}
          </section>
        )}

        {data.weaknesses && (
          <section className="p-4 rounded-lg shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
            <h3 className="text-lg lg:text-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mx-auto w-max max-w-full p-3 -mt-3 mb-4">
              Obszary do Poprawy
            </h3>
            {data.weaknesses.areas_for_improvement && (
              <ul className="space-y-3">
                {data.weaknesses.areas_for_improvement.map((area, index) => (
                  <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <strong className="text-white bg-yellow-500 px-2 py-1 rounded text-sm">
                      {area.trait}:
                    </strong>{" "}
                    <span className="text-gray-700 text-sm lg:text-base">
                      {area.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {data.weaknesses.confidence_barriers && (
              <p className="text-gray-700 text-sm lg:text-base bg-white p-3 rounded-lg shadow-sm">
                {data.weaknesses.confidence_barriers}
              </p>
            )}
          </section>
        )}

        {data.dream_alignment && (
          <section className="p-4 rounded-lg shadow-sm bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <h3 className="text-lg lg:text-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto w-max max-w-full p-3 -mt-3 mb-4">
              Dopasowanie do Celów Życiowych
            </h3>
            <p className="text-gray-700 text-sm lg:text-base bg-white p-3 rounded-lg shadow-sm mb-4">
              {data.dream_alignment.compatibility}
            </p>
            {data.dream_alignment.potential_challenges && (
              <ul className="space-y-3">
                {data.dream_alignment.potential_challenges.map(
                  (challenge, index) => (
                    <li
                      key={index}
                      className="bg-white p-3 rounded-lg shadow-sm"
                    >
                      <strong className="text-white bg-purple-500 px-2 py-1 rounded text-sm">
                        {challenge.challenge}:
                      </strong>{" "}
                      <span className="text-gray-700 text-sm lg:text-base">
                        {challenge.solution}
                      </span>
                    </li>
                  )
                )}
              </ul>
            )}
          </section>
        )}

        {data.personalized_advice && (
          <section className="p-4 rounded-lg shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
            <h3 className="text-lg lg:text-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg mx-auto w-max max-w-full p-3 -mt-3 mb-4">
              Spersonalizowane Porady
            </h3>
            {data.personalized_advice.self_improvement_tips && (
              <ul className="space-y-3">
                {data.personalized_advice.self_improvement_tips.map(
                  (tip, index) => (
                    <li
                      key={index}
                      className="bg-white p-3 rounded-lg shadow-sm text-sm lg:text-base text-gray-700"
                    >
                      {tip}
                    </li>
                  )
                )}
              </ul>
            )}
            {data.personalized_advice.mindset_shift && (
              <p className="text-gray-700 text-sm lg:text-base bg-white p-3 rounded-lg shadow-sm">
                {data.personalized_advice.mindset_shift}
              </p>
            )}
          </section>
        )}

        {/* Recommended Courses Section */}
        <section className="p-4 rounded-lg shadow-sm bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200">
          <h3 className="text-lg lg:text-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-green-500 rounded-lg mx-auto w-max max-w-full p-3 -mt-3 mb-4">
            Polecane Kursy
          </h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Ładowanie kursów...</p>
            </div>
          ) : recommendedCourses.length > 0 ? (
            <div className="space-y-4">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant="horizontal"
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Brak dostępnych kursów</p>
            </div>
          )}
        </section>
      </div>

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
};

export default PersonalReport;
