import { updateDocument } from "@/firebase";

// Sample questions for a diet plan
const sampleQuestions = [
  {
    question: "Jaki jest Twój główny cel związany z dietą?",
    answers: [
      "Utrata wagi",
      "Przyrost masy mięśniowej",
      "Poprawa zdrowia i samopoczucia",
      "Zwiększenie energii",
      "Kontrola chorób przewlekłych"
    ]
  },
  {
    question: "Ile posiłków dziennie preferujesz?",
    answers: [
      "3 posiłki",
      "4 posiłki",
      "5 posiłków",
      "6 posiłków",
      "Elastycznie w zależności od dnia"
    ]
  },
  {
    question: "Czy masz jakieś alergie pokarmowe?",
    answers: [
      "Nie mam alergii",
      "Gluten",
      "Laktoza",
      "Orzechy",
      "Jajka",
      "Inne (proszę podać w uwagach)"
    ]
  },
  {
    question: "Jaki jest Twój poziom aktywności fizycznej?",
    answers: [
      "Siedzący tryb życia (brak ćwiczeń)",
      "Lekka aktywność (1-3 razy w tygodniu)",
      "Umiarkowana aktywność (3-5 razy w tygodniu)",
      "Wysoka aktywność (6-7 razy w tygodniu)",
      "Bardzo wysoka aktywność (sport zawodowy)"
    ]
  },
  {
    question: "Jakie są Twoje preferencje smakowe?",
    answers: [
      "Lubię wszystko",
      "Preferuję pikantne potrawy",
      "Lubię słodkie smaki",
      "Wolę neutralne smaki",
      "Mam specyficzne preferencje"
    ]
  }
];

// Function to add questions to a diet plan
async function addQuestionsToDiet(dietId) {
  try {
    await updateDocument(
      ["questions"],
      [sampleQuestions],
      "courses",
      dietId
    );
    console.log(`Successfully added questions to diet plan ${dietId}`);
  } catch (error) {
    console.error(`Error adding questions to diet plan ${dietId}:`, error);
  }
}

// Example usage - replace with actual diet plan ID
// addQuestionsToDiet("your-diet-plan-id");

export { addQuestionsToDiet, sampleQuestions }; 