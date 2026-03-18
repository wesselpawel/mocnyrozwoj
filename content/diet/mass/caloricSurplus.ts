/**
 * Blok — nadwyżka kaloryczna przy budowaniu masy
 */

import { getCitations, formatCitationsBlock } from "@/content/diet/citations";

export function getCaloricSurplus(calorie: number): string {
  const estimatedMaintenance = calorie - 400;
  const maintenanceRange = `${estimatedMaintenance - 100}–${estimatedMaintenance + 100}`;
  const citationBlock = formatCitationsBlock(
    getCitations("mass", "surplus"),
    "nadwyżka kaloryczna wpływa na skład przyrostu masy — zbyt duża sprzyja głównie tkance tłuszczowej, umiarkowana (np. 300–500 kcal) wspiera przyrost mięśni"
  );

  return `Aby zwiększać masę mięśniową, konieczne jest wprowadzenie nadwyżki kalorycznej, czyli spożywanie większej liczby kalorii niż wynosi zapotrzebowanie organizmu.

Najczęściej zaleca się nadwyżkę:
• 300–500 kcal dziennie dla osób początkujących,
• 200–300 kcal dla osób zaawansowanych.

Zbyt duża nadwyżka (np. 1000 kcal) zwykle prowadzi głównie do odkładania tkanki tłuszczowej, a nie szybszego przyrostu mięśni.

Dlatego dieta ${calorie} kcal ma sens przede wszystkim u osób, których zapotrzebowanie wynosi około ${maintenanceRange} kcal.
${citationBlock ? `\n\n${citationBlock}` : ""}

Więcej o tym, jak działa nadwyżka kaloryczna, przeczytasz w artykule [dieta na masę – podstawy budowania mięśni](/dieta/na-mase).`;
}
