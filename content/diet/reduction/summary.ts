/**
 * Blok — podsumowanie diety redukcyjnej
 */

export function getSummary(calorie: number): string {
  return `Dieta redukcyjna ${calorie} kcal może być skutecznym sposobem na zmniejszenie masy ciała, jeśli jest odpowiednio zaplanowana.

**Kluczowe zasady skutecznej redukcji:**

✓ Utrzymanie umiarkowanego deficytu kalorycznego (300–500 kcal dziennie)
✓ Odpowiednia ilość białka (1,6–2 g/kg masy ciała)
✓ Duża ilość warzyw i błonnika w każdym posiłku
✓ Regularność posiłków bez pomijania i głodówek
✓ Wybór produktów o wysokiej wartości odżywczej
✓ Odpowiednie nawodnienie (min. 2 litry wody dziennie)
✓ Połączenie diety z aktywnością fizyczną
✓ Cierpliwość — zdrowa redukcja to 0,5–1 kg tygodniowo

**Czego unikać:**

✗ Zbyt drastycznego ograniczania kalorii
✗ Pomijania posiłków i głodówek
✗ Produktów wysoko przetworzonych
✗ Słodzonych napojów
✗ Niecierpliwości i oczekiwania szybkich efektów

Dieta ${calorie} kcal jest szczególnie odpowiednia dla osób o mniejszej masie ciała lub niższej aktywności fizycznej. Przed rozpoczęciem diety warto skonsultować się z dietetykiem lub lekarzem, aby upewnić się, że jest ona odpowiednia dla Twoich indywidualnych potrzeb.`;
}
