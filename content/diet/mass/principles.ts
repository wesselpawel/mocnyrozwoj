/**
 * Blok — zasady diety na masę
 */

function mealLabel(count: number): string {
  if (count === 3 || count === 4) return `${count} posiłki`;
  return `${count} posiłków`;
}

export function getPrinciples(calorie: number, mealCount: number): string {
  const meals = mealLabel(mealCount);
  return `1. Utrzymanie nadwyżki kalorycznej
Podstawą diety na masę jest dostarczanie większej ilości energii niż wynosi zapotrzebowanie organizmu.

2. Odpowiednia ilość białka
Białko jest kluczowym składnikiem budulcowym mięśni. W diecie na masę zaleca się spożycie 1,6–2,2 g białka na kilogram masy ciała.

Źródła białka: mięso (kurczak, indyk, wołowina), ryby, jaja, nabiał, rośliny strączkowe, odżywki białkowe.

3. Węglowodany jako główne źródło energii
Węglowodany wspierają wydolność treningową i regenerację.

Najlepsze źródła: ryż, makaron, kasza, ziemniaki, płatki owsiane, pieczywo pełnoziarniste.

4. Zdrowe tłuszcze
Tłuszcze są ważne dla gospodarki hormonalnej i dostarczają dużo energii.

Źródła tłuszczów: oliwa z oliwek, orzechy, nasiona, awokado, tłuste ryby.

5. Odpowiednia liczba posiłków
W tej diecie stosujemy ${meals} dziennie, aby łatwiej dostarczyć ${calorie} kcal.

Jednak liczba posiłków nie jest kluczowa — ważniejsza jest całkowita podaż kalorii i makroskładników.

6. Regularny trening siłowy
Bez treningu nadwyżka kaloryczna prowadzi głównie do odkładania tkanki tłuszczowej.

Dieta na masę powinna być połączona z:
• treningiem siłowym 3–5 razy w tygodniu,
• odpowiednią regeneracją,
• snem (7–9 godzin).

7. Nawodnienie
Odpowiednie nawodnienie wspiera wydolność i regenerację organizmu. Najczęściej zaleca się 30–40 ml wody na kilogram masy ciała dziennie.`;
}
