/**
 * Blok intro — dieta na utrzymanie wagi
 * Sekcja: Dieta na utrzymanie wagi X kcal – dla kogo jest?
 */

export function getIntro(calorie: number): string {
  const rangeMin = calorie - 100;
  const rangeMax = calorie + 100;

  return `Dieta o kaloryczności ${calorie} kcal dziennie może odpowiadać osobom, których zapotrzebowanie energetyczne wynosi około ${rangeMin}–${rangeMax} kcal.

Najczęściej będzie odpowiednia dla:

• mężczyzn o umiarkowanej aktywności fizycznej
• osób aktywnych fizycznie
• osób po zakończonej redukcji
• osób chcących utrzymać aktualną wagę

Celem takiej diety jest utrzymanie równowagi energetycznej, czyli spożywanie tylu kalorii, ile organizm zużywa każdego dnia.

Dzięki temu masa ciała pozostaje stabilna.

Aby sprawdzić, czy ta kaloryczność jest dla Ciebie odpowiednia, [oblicz swoje zapotrzebowanie w kalkulatorze kalorii](/kalkulator-kcal).`;
}
