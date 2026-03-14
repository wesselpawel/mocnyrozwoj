/**
 * Blok — zasady diety redukcyjnej
 */

function mealLabel(count: number): string {
  if (count === 3 || count === 4) return `${count} posiłki`;
  return `${count} posiłków`;
}

export function getPrinciples(calorie: number, mealCount: number): string {
  const meals = mealLabel(mealCount);
  return `1. Utrzymanie umiarkowanego deficytu kalorycznego
Podstawą diety redukcyjnej jest dostarczanie mniejszej ilości energii niż wynosi zapotrzebowanie organizmu. Deficyt powinien wynosić około 300–500 kcal dziennie.

2. Odpowiednia ilość białka
Białko zwiększa uczucie sytości i pomaga chronić masę mięśniową podczas redukcji.

Najczęściej zaleca się:
**1,6–2 g białka na kg masy ciała**

Źródła białka: chude mięso (kurczak, indyk), ryby, jaja, nabiał niskotłuszczowy, rośliny strączkowe.

3. Duża ilość warzyw
Warzywa dostarczają:
• błonnika zwiększającego sytość,
• witamin i składników mineralnych,
• a jednocześnie mają niewiele kalorii.

Staraj się, aby warzywa stanowiły podstawę każdego posiłku.

4. Produkty o wysokiej wartości odżywczej
Podstawę diety powinny stanowić:
• chude mięso i ryby,
• jajka,
• produkty pełnoziarniste,
• warzywa i owoce,
• zdrowe tłuszcze w umiarkowanych ilościach.

5. Regularność posiłków
W diecie ${calorie} kcal na ${meals} warto rozłożyć kalorie równomiernie, aby uniknąć nagłych napadów głodu.

Regularność posiłków pomaga:
• utrzymać stabilny poziom energii,
• kontrolować apetyt,
• unikać podjadania między posiłkami.

6. Odpowiednie nawodnienie
Picie odpowiedniej ilości wody:
• wspiera metabolizm,
• zwiększa uczucie sytości,
• pomaga w eliminacji toksyn.

Zaleca się około 30–35 ml wody na kilogram masy ciała dziennie.

7. Aktywność fizyczna
Dla optymalnych efektów redukcji warto połączyć dietę z:
• treningiem siłowym (chroni masę mięśniową),
• aktywnością cardio (zwiększa wydatek energetyczny),
• codzienną aktywnością (spacery, schody zamiast windy).`;
}
