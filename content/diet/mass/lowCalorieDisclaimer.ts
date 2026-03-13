/**
 * Blok — disclaimer dla diet na masę o niskiej kaloryczności (1500-2200 kcal)
 * Te kalorie są zazwyczaj zbyt niskie dla budowania masy mięśniowej
 */

export function getLowCalorieDisclaimer(calorie: number): string | null {
  if (calorie > 2200) return null;

  if (calorie <= 1600) {
    return `Czy dieta na masę ${calorie} kcal istnieje?

W praktyce dieta na masę ${calorie} kcal jest bardzo rzadko stosowana. Dla większości dorosłych osób taka kaloryczność oznacza deficyt energetyczny, który prowadzi raczej do redukcji masy ciała niż do budowania mięśni.

Budowanie masy mięśniowej wymaga bowiem nadwyżki kalorycznej, czyli spożywania większej liczby kalorii niż wynosi zapotrzebowanie organizmu.

Dla porównania:
• przeciętna kobieta potrzebuje około 1800–2200 kcal, aby utrzymać masę ciała
• przeciętny mężczyzna około 2200–2800 kcal

W takim przypadku dieta ${calorie} kcal oznaczałaby znaczący deficyt kaloryczny.

Dlaczego ${calorie} kcal nie sprzyja budowaniu masy mięśniowej?

Budowanie mięśni wymaga:
• nadwyżki energetycznej
• odpowiedniej ilości białka
• treningu siłowego
• regeneracji

Jeżeli organizm otrzymuje zbyt mało energii, zamiast budować nowe tkanki zaczyna oszczędzać energię, co utrudnia rozwój masy mięśniowej.

W skrajnych przypadkach długotrwała dieta o zbyt niskiej kaloryczności może prowadzić nawet do utraty mięśni.

Czy są sytuacje, w których masa na ${calorie} kcal jest możliwa?

Teoretycznie tak, ale są to bardzo rzadkie przypadki.

Może to dotyczyć osób:
• o bardzo niskiej masie ciała
• o niewielkim wzroście
• z bardzo niskim zapotrzebowaniem energetycznym

Przykładowo osoba, której zapotrzebowanie wynosi około ${calorie - 200}–${calorie - 100} kcal, mogłaby budować masę przy ${calorie} kcal. Jednak w praktyce takie sytuacje zdarzają się rzadko.

Od jakiej kaloryczności zaczyna się dieta na masę?

W większości przypadków diety na masę zaczynają się od około:
• 2300–2500 kcal u kobiet
• 2600–3000 kcal u mężczyzn

Dokładna wartość zależy od masy ciała, poziomu aktywności, metabolizmu i objętości treningów.`;
  }

  // 1700-2200 kcal - łagodniejszy disclaimer
  return `Czy dieta na masę ${calorie} kcal jest odpowiednia?

Dieta ${calorie} kcal na masę mięśniową może być stosowana, ale tylko w określonych przypadkach. Dla wielu osób taka kaloryczność może oznaczać zbyt małą nadwyżkę kaloryczną lub nawet deficyt.

Budowanie masy mięśniowej wymaga nadwyżki kalorycznej, czyli spożywania większej liczby kalorii niż wynosi zapotrzebowanie organizmu.

Dla porównania:
• przeciętna kobieta potrzebuje około 1800–2200 kcal, aby utrzymać masę ciała
• przeciętny mężczyzna około 2200–2800 kcal

Dieta ${calorie} kcal na masę może być odpowiednia dla:
• kobiet o mniejszej masie ciała i umiarkowanej aktywności
• osób z niższym zapotrzebowaniem energetycznym
• osób rozpoczynających budowanie masy od niewielkiej nadwyżki

Ważne: Przed rozpoczęciem diety na masę warto obliczyć swoje indywidualne zapotrzebowanie kaloryczne i upewnić się, że ${calorie} kcal faktycznie stanowi nadwyżkę, a nie deficyt.

W większości przypadków typowe diety na masę zaczynają się od:
• 2300–2500 kcal u kobiet
• 2600–3000 kcal u mężczyzn`;
}
