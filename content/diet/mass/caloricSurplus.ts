/**
 * Blok — nadwyżka kaloryczna przy budowaniu masy
 */

export function getCaloricSurplus(calorie: number): string {
  const estimatedMaintenance = calorie - 400;
  const maintenanceRange = `${estimatedMaintenance - 100}–${estimatedMaintenance + 100}`;

  return `Aby zwiększać masę mięśniową, konieczne jest wprowadzenie nadwyżki kalorycznej, czyli spożywanie większej liczby kalorii niż wynosi zapotrzebowanie organizmu.

Najczęściej zaleca się nadwyżkę:
• 300–500 kcal dziennie dla osób początkujących,
• 200–300 kcal dla osób zaawansowanych.

Zbyt duża nadwyżka (np. 1000 kcal) zwykle prowadzi głównie do odkładania tkanki tłuszczowej, a nie szybszego przyrostu mięśni.

Dlatego dieta ${calorie} kcal ma sens przede wszystkim u osób, których zapotrzebowanie wynosi około ${maintenanceRange} kcal.

Więcej o tym, jak działa nadwyżka kaloryczna, przeczytasz w artykule [dieta na masę – podstawy budowania mięśni](/dieta/na-mase).`;
}
