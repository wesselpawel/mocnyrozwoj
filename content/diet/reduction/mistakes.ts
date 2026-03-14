/**
 * Blok — czego unikać na diecie redukcyjnej
 */

export function getMistakes(calorie: number): string {
  return `Podczas redukcji warto ograniczyć produkty o niskiej wartości odżywczej, takie jak:

**Produkty do unikania:**
• słodycze i wyroby cukiernicze,
• fast-food,
• słodzone napoje (cola, soki, napoje energetyczne),
• wysoko przetworzone przekąski (chipsy, paluszki),
• produkty bogate w tłuszcze trans,
• alkohol,
• białe pieczywo i produkty z białej mąki,
• tłuste sosy i dressingi.

**Typowe błędy na redukcji:**

1. **Zbyt duży deficyt kaloryczny**
Deficyt większy niż 700–1000 kcal dziennie może spowolnić metabolizm i prowadzić do utraty masy mięśniowej.

2. **Pomijanie białka**
Niedobór białka powoduje utratę mięśni zamiast tkanki tłuszczowej. Przy diecie ${calorie} kcal szczególnie ważne jest, aby białko stanowiło priorytet.

3. **Brak warzyw i błonnika**
Błonnik zwiększa sytość i wspiera zdrowe trawienie. Każdy posiłek powinien zawierać porcję warzyw.

4. **Głodówki i pomijanie posiłków**
Długie przerwy bez jedzenia prowadzą do napadów głodu i podjadania wysokokalorycznych przekąsek.

5. **Picie kalorii**
Słodzone napoje, soki i latte dostarczają pustych kalorii bez sytości.

6. **Brak planowania posiłków**
Bez planu łatwo sięgnąć po niezdrowe opcje. Przygotowywanie posiłków z wyprzedzeniem (meal prep) bardzo pomaga.

7. **Zbyt szybkie oczekiwania**
Zdrowa redukcja to proces długoterminowy. Oczekiwanie szybkich efektów prowadzi do frustracji i porzucenia diety.`;
}
