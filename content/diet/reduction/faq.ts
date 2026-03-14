import { FAQItem } from "@/components/FAQ";

export function getReductionDietFAQ(calorie: number): FAQItem[] {
  return [
    {
      question: `Czy dieta ${calorie} kcal jest zdrowa?`,
      answer: `Może być zdrowa, jeśli jest odpowiednio zbilansowana i dostarcza wszystkich niezbędnych składników odżywczych.

Kluczowe jest, aby dieta ${calorie} kcal zawierała:
- odpowiednią ilość białka (1,6–2 g/kg masy ciała)
- warzywa i owoce dostarczające witamin
- zdrowe tłuszcze (oliwa, orzechy, ryby)
- produkty pełnoziarniste

Dieta ${calorie} kcal może być niewystarczająca dla osób o wysokim zapotrzebowaniu energetycznym (bardzo aktywnych fizycznie, z dużą masą ciała). W takich przypadkach warto skonsultować kaloryczność z dietetykiem.`,
    },
    {
      question: `Czy 3 posiłki dziennie wystarczą na redukcji?`,
      answer: `Dla wielu osób trzy większe posiłki są wygodne i pomagają utrzymać sytość.

**Zalety 3 posiłków dziennie:**
- większe porcje dają lepsze uczucie sytości
- łatwiejsze planowanie i przygotowywanie
- mniej okazji do podjadania

**Kiedy rozważyć więcej posiłków:**
- przy bardzo intensywnym treningu
- gdy odczuwasz silny głód między posiłkami
- przy problemach z trawieniem dużych porcji

Najważniejsza jest całkowita liczba kalorii i makroskładników w ciągu dnia, nie liczba posiłków.`,
    },
    {
      question: `Czy można ćwiczyć na diecie ${calorie} kcal?`,
      answer: `Tak, jednak intensywność treningów powinna być dopasowana do poziomu energii i zapotrzebowania kalorycznego.

**Zalecenia treningowe na redukcji:**
- trening siłowy 3–4 razy w tygodniu (chroni masę mięśniową)
- umiarkowane cardio (spacery, rower, pływanie)
- słuchaj swojego organizmu – przy zmęczeniu zmniejsz intensywność

Przy diecie ${calorie} kcal może być trudno utrzymać bardzo intensywne treningi. Jeśli odczuwasz chroniczne zmęczenie, rozważ zwiększenie kaloryczności lub zmniejszenie intensywności ćwiczeń.`,
    },
    {
      question: `Jak szybko schudnę na diecie ${calorie} kcal?`,
      answer: `Tempo redukcji zależy od Twojego zapotrzebowania kalorycznego i wielkości deficytu.

**Przykład:**
Jeśli Twoje zapotrzebowanie wynosi ${calorie + 500} kcal, dieta ${calorie} kcal stworzy deficyt 500 kcal dziennie, co przekłada się na utratę około 0,5 kg tygodniowo.

**Bezpieczne tempo redukcji:**
- 0,5–1 kg tygodniowo
- 2–4 kg miesięcznie
- 10–20 kg w pół roku

Szybsza utrata masy ciała jest możliwa, ale może prowadzić do utraty mięśni i efektu jo-jo.`,
    },
    {
      question: `Czy na diecie redukcyjnej można jeść węglowodany?`,
      answer: `Tak, węglowodany są ważną częścią zbilansowanej diety redukcyjnej.

**Najlepsze źródła węglowodanów na redukcji:**
- produkty pełnoziarniste (ryż brązowy, kasza, płatki owsiane)
- warzywa (szczególnie strączkowe)
- owoce (w umiarkowanych ilościach)
- ziemniaki

**Czego unikać:**
- cukrów prostych (słodycze, napoje słodzone)
- produktów z białej mąki
- wysoko przetworzonych przekąsek

Węglowodany złożone dostarczają energii i pomagają utrzymać wydolność treningową.`,
    },
    {
      question: `Co zrobić, gdy na diecie ${calorie} kcal odczuwam silny głód?`,
      answer: `Silny głód może oznaczać, że dieta wymaga modyfikacji.

**Sposoby na zmniejszenie głodu:**
- zwiększ ilość białka w posiłkach
- jedz więcej warzyw (wypełniają żołądek)
- pij więcej wody (czasem pragnienie jest mylone z głodem)
- jedz wolniej i bardziej świadomie
- dodaj produkty bogate w błonnik

**Jeśli głód jest chroniczny:**
- rozważ zwiększenie kaloryczności diety
- skonsultuj się z dietetykiem
- upewnij się, że deficyt nie jest zbyt duży`,
    },
    {
      question: `Czy dieta ${calorie} kcal jest odpowiednia dla każdego?`,
      answer: `Nie, dieta ${calorie} kcal nie jest uniwersalna.

**Może być odpowiednia dla:**
- osób o mniejszej masie ciała
- osób o niskiej lub umiarkowanej aktywności fizycznej
- osób z niższym zapotrzebowaniem kalorycznym (np. kobiety o niższym wzroście)

**Może być niewystarczająca dla:**
- osób bardzo aktywnych fizycznie
- osób z dużą masą ciała
- mężczyzn o wysokim wzroście
- osób wykonujących ciężką pracę fizyczną

Zawsze najlepiej obliczyć indywidualne zapotrzebowanie kaloryczne i od niego odjąć odpowiedni deficyt.`,
    },
    {
      question: "Czy dieta redukcyjna powoduje efekt jo-jo?",
      answer: `Efekt jo-jo nie jest nieunikniony, ale może wystąpić przy nieodpowiednim podejściu.

**Jak uniknąć efektu jo-jo:**
- stosuj umiarkowany deficyt (nie drastyczny)
- wprowadzaj stopniowe zmiany nawyków żywieniowych
- po osiągnięciu celu stopniowo zwiększaj kalorie
- utrzymuj aktywność fizyczną
- traktuj dietę jako zmianę stylu życia, nie krótkoterminową kurację

**Przyczyny efektu jo-jo:**
- zbyt drastyczne ograniczanie kalorii
- traktowanie diety jako tymczasowej
- powrót do starych nawyków po zakończeniu diety
- brak aktywności fizycznej`,
    },
    {
      question: "Ile białka jeść na redukcji?",
      answer: `Na diecie redukcyjnej zapotrzebowanie na białko jest wyższe niż normalnie.

**Zalecana ilość białka:**
**1,6–2,2 g białka na kilogram masy ciała**

Przykładowo:
- osoba ważąca 70 kg: 112–154 g białka dziennie
- osoba ważąca 80 kg: 128–176 g białka dziennie

**Dlaczego białko jest tak ważne na redukcji:**
- chroni masę mięśniową przed utratą
- zwiększa uczucie sytości
- ma wysoki efekt termiczny (spalanie kalorii przy trawieniu)

**Najlepsze źródła białka:**
- chude mięso (kurczak, indyk)
- ryby
- jajka
- nabiał niskotłuszczowy
- rośliny strączkowe`,
    },
    {
      question: "Czy można pić alkohol na diecie redukcyjnej?",
      answer: `Alkohol nie jest zalecany podczas redukcji.

**Dlaczego alkohol utrudnia redukcję:**
- dostarcza pustych kalorii (7 kcal/g)
- hamuje spalanie tłuszczu
- zwiększa apetyt
- osłabia motywację i samodyscyplinę
- zaburza regenerację po treningu

**Jeśli zdecydujesz się na alkohol:**
- wybieraj opcje niskokaloryczne (wino wytrawne, czysta wódka)
- unikaj słodkich koktajli i piwa
- wliczaj kalorie z alkoholu do dziennego bilansu
- ogranicz spożycie do okazjonalnego

Najlepiej jednak całkowicie zrezygnować z alkoholu podczas intensywnej redukcji.`,
    },
  ];
}
