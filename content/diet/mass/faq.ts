import { FAQItem } from "@/components/FAQ";

export function getMassDietFAQ(calorie: number): FAQItem[] {
  return [
    // Dynamic FAQ items (with calorie value)
    {
      question: `Czy dieta na masę ${calorie} kcal to dużo?`,
      answer: `To, czy ${calorie} kcal jest dużą ilością kalorii, zależy przede wszystkim od zapotrzebowania energetycznego danej osoby.

Dla wielu dorosłych osób zapotrzebowanie na utrzymanie masy ciała wynosi około **2000–2800 kcal dziennie**. Jeśli dieta zawiera więcej kalorii niż wynosi zapotrzebowanie organizmu, powstaje nadwyżka energetyczna, która może sprzyjać budowaniu masy mięśniowej.

W przypadku osób bardzo aktywnych fizycznie lub trenujących siłowo kilka razy w tygodniu dieta ${calorie} kcal może być odpowiednią kalorycznością wspierającą rozwój masy.`,
    },
    {
      question: `Dla kogo dieta na masę ${calorie} kcal może być odpowiednia?`,
      answer: `Dieta o kaloryczności ${calorie} kcal może być stosowana przez osoby o stosunkowo wysokim zapotrzebowaniu energetycznym.

Najczęściej dotyczy to:

- osób regularnie trenujących siłowo
- osób z dużą masą mięśniową
- osób o szybkim metabolizmie
- osób wykonujących pracę fizyczną

Dokładna kaloryczność diety powinna być jednak zawsze dopasowana indywidualnie do zapotrzebowania energetycznego.`,
    },
    {
      question: `Ile białka powinna zawierać dieta na masę ${calorie} kcal?`,
      answer: `W diecie na masę mięśniową zaleca się spożywanie około **1,6–2,2 g białka na kilogram masy ciała** dziennie.

Oznacza to, że przykładowo:

- osoba ważąca 70 kg powinna spożywać około 110–150 g białka dziennie
- osoba ważąca 90 kg około 145–200 g białka dziennie

Białko wspiera regenerację mięśni po treningu oraz pomaga w budowaniu nowej tkanki mięśniowej.

Dobre źródła białka w diecie na masę to między innymi mięso, ryby, jaja, nabiał, rośliny strączkowe oraz odżywki białkowe.`,
    },
    {
      question: `Czy można przytyć na diecie ${calorie} kcal bez treningu?`,
      answer: `Tak, zwiększenie kaloryczności diety może prowadzić do przyrostu masy ciała nawet bez treningu. W takim przypadku jednak **większość przyrostu stanowi zwykle tkanka tłuszczowa**, a nie mięśnie.

Aby zwiększać masę mięśniową, konieczne jest połączenie:

- nadwyżki kalorycznej
- odpowiedniej podaży białka
- regularnego treningu siłowego

Dzięki temu organizm wykorzystuje dodatkową energię do rozwoju mięśni, a nie tylko do magazynowania tłuszczu.`,
    },
    {
      question: `Jak szybko można zwiększyć masę ciała na diecie ${calorie} kcal?`,
      answer: `Tempo przyrostu masy zależy od wielu czynników, takich jak poziom zaawansowania treningowego, metabolizm oraz wielkość nadwyżki kalorycznej.

**Najczęściej zalecane tempo przyrostu masy:**

| Poziom | Tempo przyrostu |
|--------|-----------------|
| początkujący | około 0,5–1 kg miesięcznie |
| średnio zaawansowani | około 0,25–0,5 kg miesięcznie |
| zaawansowani | około 0,1–0,25 kg miesięcznie |

Zbyt szybkie zwiększanie masy ciała może prowadzić do nadmiernego odkładania tkanki tłuszczowej.`,
    },
    {
      question: `Jak łatwo zwiększyć kalorie w diecie ${calorie} kcal?`,
      answer: `Jeśli trudno jest zjeść dużą ilość jedzenia, pomocne mogą być **produkty o wysokiej gęstości energetycznej**.

Przykłady produktów, które łatwo zwiększają kaloryczność diety:

- oliwa z oliwek
- masło orzechowe
- orzechy
- suszone owoce
- koktajle wysokokaloryczne

Dodanie kilku takich produktów do codziennych posiłków może zwiększyć kaloryczność diety nawet o 300–500 kcal dziennie bez znacznego zwiększania objętości jedzenia.`,
    },
    {
      question: `Czy dieta na masę ${calorie} kcal jest odpowiednia dla początkujących?`,
      answer: `W wielu przypadkach osoby rozpoczynające trening siłowy nie potrzebują bardzo dużej nadwyżki kalorii.

Często wystarczy zwiększenie kaloryczności diety o około **200–300 kcal** powyżej zapotrzebowania, aby stopniowo zwiększać masę mięśniową.

Dlatego dla niektórych osób dieta ${calorie} kcal może być odpowiednia na początkowym etapie budowania masy, szczególnie jeśli wcześniej spożywali mniejszą liczbę kalorii.`,
    },
    {
      question: `Czy dieta na masę ${calorie} kcal powoduje przyrost tłuszczu?`,
      answer: `Każda dieta z nadwyżką kaloryczną może prowadzić zarówno do wzrostu masy mięśniowej, jak i tkanki tłuszczowej.

Kluczowe znaczenie mają:

- wielkość nadwyżki kalorycznej
- jakość diety
- regularność treningów siłowych

**Umiarkowana nadwyżka kalorii** oraz odpowiednio zaplanowany trening pomagają zwiększać masę mięśniową przy minimalnym przyroście tkanki tłuszczowej.`,
    },
    // Static FAQ items (general knowledge)
    {
      question: "Czy dieta na masę zawsze oznacza jedzenie bardzo dużej ilości kalorii?",
      answer: `Nie zawsze. Dieta na masę polega przede wszystkim na wprowadzeniu nadwyżki kalorycznej, czyli spożywaniu nieco większej liczby kalorii niż wynosi zapotrzebowanie organizmu.

Najczęściej nadwyżka wynosi około **200–500 kcal dziennie**. Taka ilość energii pozwala stopniowo zwiększać masę mięśniową bez nadmiernego przyrostu tkanki tłuszczowej.

W praktyce oznacza to, że dla jednej osoby dieta na masę może mieć 2500 kcal, a dla innej nawet 3500 kcal lub więcej. Wszystko zależy od masy ciała, poziomu aktywności fizycznej oraz metabolizmu.`,
    },
    {
      question: "Ile białka powinno się jeść na masie?",
      answer: `W diecie na masę mięśniową zaleca się spożywanie około:

**1,6–2,2 g białka na kilogram masy ciała dziennie.**

Przykładowo osoba ważąca 80 kg powinna spożywać około 130–175 g białka dziennie.

Dobre źródła białka w diecie na masę to między innymi:

- mięso drobiowe
- wołowina
- ryby
- jaja
- nabiał
- rośliny strączkowe
- odżywki białkowe

Odpowiednia podaż białka wspiera regenerację mięśni po treningu oraz pomaga budować nową tkankę mięśniową.`,
    },
    {
      question: "Ile posiłków dziennie jeść na masie?",
      answer: `Nie istnieje jedna idealna liczba posiłków dla wszystkich. Najważniejsze jest osiągnięcie odpowiedniej liczby kalorii i makroskładników w ciągu dnia.

Najczęściej osoby budujące masę jedzą **4–6 posiłków dziennie**, ponieważ pozwala to łatwiej dostarczyć większą ilość kalorii.

Niektóre osoby preferują jednak 3 większe posiłki, podczas gdy inne wolą więcej mniejszych posiłków. Wybór powinien być dopasowany do indywidualnych preferencji oraz trybu dnia.`,
    },
    {
      question: "Czy można budować masę bez treningu siłowego?",
      answer: `Teoretycznie zwiększenie kalorii w diecie może prowadzić do wzrostu masy ciała, jednak **bez treningu siłowego większość przyrostu stanowi tkanka tłuszczowa**, a nie mięśnie.

Trening siłowy jest ważny, ponieważ daje organizmowi sygnał do budowania i wzmacniania mięśni. Bez tego bodźca nadwyżka kaloryczna nie zostanie efektywnie wykorzystana do rozwoju masy mięśniowej.

Dlatego dieta na masę powinna być zawsze połączona z regularnym treningiem oporowym.`,
    },
    {
      question: "Jak szybko można przybrać na masie?",
      answer: `Tempo przyrostu masy ciała zależy od poziomu zaawansowania treningowego.

**Orientacyjne tempo przyrostu masy mięśniowej:**

| Poziom | Tempo przyrostu |
|--------|-----------------|
| początkujący | około 0,5–1 kg miesięcznie |
| średnio zaawansowani | około 0,25–0,5 kg miesięcznie |
| zaawansowani | około 0,1–0,25 kg miesięcznie |

Zbyt szybki przyrost masy ciała często oznacza nadmierny przyrost tkanki tłuszczowej.`,
    },
    {
      question: "Jak zwiększyć kalorie w diecie, gdy trudno jest dużo jeść?",
      answer: `Wiele osób ma problem z dostarczeniem odpowiedniej liczby kalorii podczas budowania masy mięśniowej.

W takich sytuacjach warto wybierać **produkty o wysokiej gęstości energetycznej**, czyli takie, które zawierają dużo kalorii w niewielkiej objętości.

Przykłady produktów, które łatwo zwiększają kaloryczność diety:

- oliwa z oliwek
- masło orzechowe
- orzechy
- suszone owoce
- granola
- koktajle wysokokaloryczne

Dodanie kilku takich produktów do posiłków może znacząco zwiększyć dzienną liczbę kalorii bez konieczności jedzenia bardzo dużych porcji.`,
    },
    {
      question: "Czy na masie trzeba unikać wszystkich słodyczy?",
      answer: `Nie ma potrzeby całkowitego eliminowania słodyczy z diety na masę, jednak powinny one stanowić jedynie **niewielki dodatek** do jadłospisu.

Podstawą diety powinny być produkty bogate w składniki odżywcze, takie jak:

- pełnoziarniste produkty zbożowe
- mięso i ryby
- nabiał
- warzywa i owoce
- zdrowe tłuszcze

Słodycze mogą pojawiać się okazjonalnie, jednak nadmierne ich spożycie może prowadzić do nadmiernego przyrostu tkanki tłuszczowej.`,
    },
    {
      question: "Czy dieta na masę jest zdrowa?",
      answer: `Dieta na masę może być zdrowa, o ile jest dobrze zbilansowana i opiera się na wartościowych produktach.

Powinna ona dostarczać:

- odpowiednią ilość kalorii
- białko wspierające rozwój mięśni
- zdrowe tłuszcze
- węglowodany dostarczające energii
- witaminy i składniki mineralne

Najważniejsze jest unikanie nadmiernego spożycia żywności wysoko przetworzonej oraz dbanie o odpowiednią jakość posiłków.`,
    },
  ];
}
