/**
 * Blok — deficyt kaloryczny przy redukcji
 */

export function getCaloricDeficit(calorie: number): string {
  return `Aby dieta redukcyjna była skuteczna, należy utrzymać umiarkowany deficyt kaloryczny.

Najczęściej przyjmuje się, że deficyt powinien wynosić około:
**300–500 kcal dziennie**

Dzięki temu:
• redukcja jest stabilna i możliwa do utrzymania,
• organizm nie traci zbyt szybko masy mięśniowej,
• łatwiej utrzymać dietę przez dłuższy czas,
• unika się efektu jo-jo po zakończeniu diety.

Przy diecie ${calorie} kcal oznacza to, że zapotrzebowanie bazowe osoby stosującej tę dietę powinno wynosić około ${calorie + 300}–${calorie + 500} kcal dziennie.

**Uwaga:** Zbyt duży deficyt kaloryczny (powyżej 700–1000 kcal) może prowadzić do:
• spowolnienia metabolizmu,
• utraty masy mięśniowej,
• obniżenia energii i nastroju,
• problemów hormonalnych,
• trudności z utrzymaniem diety.`;
}
