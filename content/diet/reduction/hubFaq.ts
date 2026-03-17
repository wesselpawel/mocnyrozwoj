import type { FAQItem } from "@/components/FAQ";

/**
 * FAQ dla strony hub /dieta/na-redukcje/[calorie] – programmatic SEO.
 */
export function getReductionHubFaq(calorie: number): FAQItem[] {
  return [
    {
      question: `Czy ${calorie} kcal to dobra dieta na redukcję?`,
      answer: `Tak — pod jednym warunkiem: że jest to dla Ciebie deficyt kaloryczny. Jeśli wcześniej jadłeś więcej, ${calorie} kcal może skutecznie uruchomić proces chudnięcia. Jeśli jednak to poziom zbliżony do Twojego zapotrzebowania, efekty mogą być minimalne lub żadne.`,
    },
    {
      question: `Ile można schudnąć na ${calorie} kcal w miesiąc?`,
      answer: `W praktyce najczęściej jest to od około 1 do 3 kg miesięcznie. Tempo zależy od punktu wyjścia, aktywności i konsekwencji. Im większa nadwaga na starcie, tym szybciej organizm reaguje.`,
    },
    {
      question: `Czy ${calorie} kcal to dużo na redukcji?`,
      answer: `To jedno z tych pytań, na które nie ma jednej odpowiedzi. Dla osoby aktywnej fizycznie ${calorie} kcal może być solidnym deficytem. Dla osoby niskiej, z małą aktywnością — może być już poziomem utrzymania. Kontekst zawsze ma znaczenie.`,
    },
    {
      question: `Dlaczego nie chudnę jedząc ${calorie} kcal?`,
      answer: `Najczęściej powód jest prozaiczny: brak realnego deficytu. Może to wynikać z niedoszacowania kalorii, podjadania, „ukrytych kalorii” w napojach lub przeszacowanej aktywności. Jeśli wszystko jest policzone dokładnie, oznacza to po prostu, że ${calorie} kcal to dla Ciebie za dużo.`,
    },
    {
      question: `Ile posiłków najlepiej jeść na redukcji ${calorie} kcal?`,
      answer: `Nie ma „magicznej liczby”. Możesz schudnąć jedząc trzy, cztery lub pięć posiłków dziennie. Liczy się całkowita liczba kalorii w ciągu dnia, a nie rozkład godzinowy. Wybierz model, który jesteś w stanie utrzymać na dłużej.`,
    },
    {
      question: `Czy można schudnąć na ${calorie} kcal bez ćwiczeń?`,
      answer: `Tak — redukcja wynika z deficytu kalorycznego, nie z samego treningu. Ćwiczenia pomagają przyspieszyć efekty i poprawić wygląd sylwetki, ale nie są warunkiem koniecznym do utraty wagi.`,
    },
    {
      question: `Ile białka jeść na redukcji ${calorie} kcal?`,
      answer: `Najczęściej rekomenduje się zakres około 1,6–2,2 g białka na kilogram masy ciała. Wyższa podaż białka pomaga utrzymać mięśnie i zwiększa uczucie sytości, co realnie ułatwia trzymanie diety.`,
    },
    {
      question: `Czy ${calorie} kcal to dobra dieta dla kobiety?`,
      answer: `Może być — szczególnie dla kobiet aktywnych lub o wyższym zapotrzebowaniu kalorycznym. W wielu przypadkach jednak skuteczniejsza redukcja zaczyna się przy niższych wartościach, np. 1600–1900 kcal.`,
    },
    {
      question: `Co jeśli waga stoi na ${calorie} kcal?`,
      answer: `To sygnał, że organizm osiągnął równowagę. W takiej sytuacji najczęściej pomaga niewielka korekta: obniżenie kalorii o 100–200 kcal albo zwiększenie aktywności. Kluczowe jest, by nie robić gwałtownych zmian, tylko działać stopniowo.`,
    },
    {
      question: "Czy na redukcji trzeba rezygnować z ulubionych produktów?",
      answer: `Nie — i to dobra wiadomość. Skuteczna dieta redukcyjna nie polega na eliminacji wszystkiego, co lubisz, tylko na kontrolowaniu bilansu kalorii. Restrykcyjne podejście często działa krótkoterminowo, ale długofalowo prowadzi do frustracji i efektu jojo.`,
    },
  ];
}
