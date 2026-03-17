/**
 * Blok — bilans kaloryczny przy utrzymaniu wagi
 */

export function getCaloricBalance(calorie: number): string {
  return `Aby utrzymać masę ciała, należy dostarczać tyle kalorii, ile wynosi zapotrzebowanie organizmu.

W praktyce oznacza to:

**bilans kaloryczny = 0**

czyli:

**kalorie spożyte ≈ kalorie spalone.**

Jeżeli kalorie są:

• **wyższe** → masa ciała rośnie
• **niższe** → masa ciała spada
• **równe** → masa ciała pozostaje stabilna

Dlatego dieta ${calorie} kcal będzie odpowiednia dla osób, których zapotrzebowanie energetyczne wynosi około ${calorie} kcal dziennie.

Więcej o tym, jak obliczyć swoje zapotrzebowanie, przeczytasz w artykule [dieta na utrzymanie wagi – jak utrzymać formę](/dieta/na-utrzymanie-wagi) oraz w [kalkulatorze kalorii](/kalkulator-kcal).`;
}
