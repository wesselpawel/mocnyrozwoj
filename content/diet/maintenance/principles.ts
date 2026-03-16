/**
 * Blok — zasady diety na utrzymanie wagi
 */

function mealLabel(count: number): string {
  if (count === 3 || count === 4) return `${count} posiłki`;
  return `${count} posiłków`;
}

export function getPrinciples(calorie: number, mealCount: number): string {
  const meals = mealLabel(mealCount);

  return `1. Utrzymanie bilansu kalorycznego

Najważniejszym elementem diety na utrzymanie wagi jest dostarczanie takiej ilości kalorii, jaka odpowiada zapotrzebowaniu organizmu.

2. Odpowiednia ilość białka

Białko pomaga:

• utrzymać masę mięśniową
• zwiększyć sytość posiłków
• wspierać regenerację organizmu

Najczęściej zaleca się:

**1,2–1,8 g białka / kg masy ciała**

3. Zbilansowane makroskładniki

Dieta powinna zawierać:

• białko
• węglowodany
• tłuszcze

Najczęściej stosowany rozkład:

• białko: 15–25% kalorii
• tłuszcze: 20–35% kalorii
• węglowodany: 40–55% kalorii

4. Regularne posiłki

W tej diecie stosujemy ${meals} dziennie, aby łatwiej utrzymać około ${calorie} kcal.

Regularne jedzenie pomaga:

• utrzymać stabilny poziom energii
• kontrolować apetyt
• zapobiegać podjadaniu

5. Aktywność fizyczna

Regularna aktywność pomaga utrzymać zdrową masę ciała i dobrą kondycję. Połączenie diety z treningiem siłowym lub umiarkowanym cardio wspiera stabilność wagi i samopoczucie.`;
}
