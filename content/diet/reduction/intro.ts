/**
 * Blok intro — dieta redukcyjna
 * Sekcja: Dla kogo jest odpowiednia?
 */

export function getIntro(calorie: number): string {
  const isVeryLow = calorie <= 1600;
  const isLow = calorie <= 2000;

  return `Dieta redukcyjna ${calorie} kcal może być odpowiednia dla osób:
• o ${isVeryLow ? "niewielkiej" : isLow ? "umiarkowanej" : "wysokiej"} aktywności fizycznej,
• chcących stopniowo zmniejszyć masę ciała,
• rozpoczynających redukcję,
• mających ${isVeryLow ? "stosunkowo niskie" : isLow ? "umiarkowane" : "wyższe"} zapotrzebowanie kaloryczne.

Wiele osób zaczyna od pytania: **ile kalorii trzeba jeść, żeby schudnąć**. Odpowiedź zawsze zależy od indywidualnego zapotrzebowania kalorycznego, czyli liczby kalorii potrzebnych do utrzymania aktualnej masy ciała.

Warto pamiętać, że zapotrzebowanie kaloryczne zależy od wielu czynników:
• płci,
• wieku,
• wzrostu,
• poziomu aktywności fizycznej,
• celu dietetycznego.

Dla przykładu: mężczyzna ważący 85 kg przy wzroście 180 cm i umiarkowanej aktywności fizycznej potrzebuje około 2400–2700 kcal dziennie, aby utrzymać masę ciała. ${
    isLow
      ? `Dieta ${calorie} kcal stworzy dla niego znaczny deficyt kaloryczny.`
      : `Dieta ${calorie} kcal będzie dla niego umiarkowanym deficytem kalorycznym.`
  }

Dlatego dieta redukcyjna zawsze powinna być dopasowana indywidualnie do zapotrzebowania energetycznego organizmu.

Aby sprawdzić, ile kalorii potrzebujesz na redukcji, [skorzystaj z kalkulatora kalorii](/kalkulator-kcal) i oblicz swoje zapotrzebowanie kaloryczne.`;
}
