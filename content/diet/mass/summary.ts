/**
 * Blok podsumowanie — dieta na masę
 */

export function getSummary(calorie: number): string {
  if (calorie <= 2200) {
    return `Dieta na masę ${calorie} kcal w praktyce nie jest typowym modelem żywienia dla budowania mięśni. Dla większości osób taka kaloryczność oznacza deficyt energetyczny i sprzyja raczej redukcji masy ciała.

Osoby chcące zwiększyć masę mięśniową powinny najpierw obliczyć swoje zapotrzebowanie kaloryczne, a następnie wprowadzić umiarkowaną nadwyżkę kalorii (zwykle 300–500 kcal powyżej zapotrzebowania).

Jeśli Twoje zapotrzebowanie jest na tyle niskie, że ${calorie} kcal stanowi nadwyżkę, pamiętaj o:
• odpowiedniej ilości białka (1,6–2,2 g/kg masy ciała),
• węglowodanach wspierających trening,
• zdrowych tłuszczach,
• regularnym treningu siłowym.

Skorzystaj z naszego kalkulatora kcal, aby poznać swoje indywidualne zapotrzebowanie.`;
  }

  return `Dieta ${calorie} kcal to ${calorie >= 3500 ? "wysokokaloryczny" : "umiarkowanie kaloryczny"} model żywienia przeznaczony ${calorie >= 3000 ? "głównie dla osób o bardzo dużym zapotrzebowaniu energetycznym" : "dla osób chcących budować masę mięśniową przy odpowiedniej aktywności fizycznej"}.

Aby skutecznie budować masę mięśniową, dieta powinna:
• zapewniać nadwyżkę kalorii,
• dostarczać odpowiednią ilość białka (1,6–2,2 g/kg masy ciała),
• zawierać węglowodany wspierające trening,
• uwzględniać zdrowe tłuszcze,
• być połączona z regularnym treningiem siłowym.

Pamiętaj, że dieta na masę powinna być dopasowana indywidualnie. Jeśli nie znasz swojego zapotrzebowania kalorycznego, skorzystaj z naszego kalkulatora kcal.`;
}
