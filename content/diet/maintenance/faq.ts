import { FAQItem } from "@/components/FAQ";

export function getMaintenanceDietFAQ(calorie: number): FAQItem[] {
  return [
    {
      question: `Czy dieta ${calorie} kcal pozwala utrzymać wagę?`,
      answer: `Tak. Dieta ${calorie} kcal pozwala utrzymać wagę, jeśli Twoje dzienne zapotrzebowanie energetyczne wynosi około ${calorie} kcal.

W takiej sytuacji spożywanie ${calorie} kcal dziennie oznacza bilans zerowy: organizm otrzymuje tyle energii, ile zużywa, więc masa ciała pozostaje stabilna.

Jeśli nie jesteś pewien swojego zapotrzebowania, [oblicz je w kalkulatorze kalorii](/kalkulator-kcal).`,
    },
    {
      question: `Dla kogo dieta ${calorie} kcal na utrzymanie wagi jest odpowiednia?`,
      answer: `Dieta ${calorie} kcal na utrzymanie wagi jest odpowiednia dla osób, których zapotrzebowanie energetyczne mieści się w przedziale około ${calorie - 100}–${calorie + 100} kcal dziennie.

Najczęściej dotyczy to mężczyzn o umiarkowanej aktywności fizycznej, osób aktywnych, osób po zakończonej redukcji oraz wszystkich, którzy chcą utrzymać aktualną masę ciała bez przybierania ani chudnięcia.`,
    },
    {
      question: `Czy można przytyć na diecie ${calorie} kcal?`,
      answer: `Tak. Jeśli Twoje zapotrzebowanie jest niższe niż ${calorie} kcal dziennie, spożywanie ${calorie} kcal będzie oznaczało nadwyżkę kaloryczną i stopniowy przyrost masy ciała.

Dlatego dieta na utrzymanie wagi powinna być dopasowana do indywidualnego zapotrzebowania. Dla jednej osoby utrzymanie to 2000 kcal, dla innej 2600 kcal. [Sprawdź swoje zapotrzebowanie w kalkulatorze](/kalkulator-kcal).`,
    },
    {
      question: `Czy dieta ${calorie} kcal jest odpowiednia dla kobiet?`,
      answer: `Zależy od zapotrzebowania. Wiele kobiet o umiarkowanej aktywności ma zapotrzebowanie w przedziale 1800–2200 kcal dziennie. Dla nich dieta ${calorie} kcal może być odpowiednia na utrzymanie wagi, jeśli ich zapotrzebowanie wynosi około ${calorie} kcal.

Kobiety bardzo aktywne fizycznie lub o większej masie ciała mogą mieć wyższe zapotrzebowanie — wtedy ${calorie} kcal może być właściwą kalorycznością na utrzymanie. Warto obliczyć swoje zapotrzebowanie indywidualnie.`,
    },
    {
      question: `Czy dieta na utrzymanie wagi wymaga liczenia kalorii?`,
      answer: `Niekoniecznie. Na początku liczenie kalorii przez kilka dni może pomóc zorientować się, ile faktycznie jesz i czy trzymasz się celu.

Po czasie wiele osób utrzymuje wagę bez codziennego liczenia — dzięki regularnym posiłkom, kontroli porcji, unikaniu nadmiernego podjadania i wyborowi wartościowych produktów. Kluczowe jest wyrobienie nawyków, które naturalnie utrzymują bilans energetyczny.`,
    },
  ];
}
