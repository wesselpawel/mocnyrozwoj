/**
 * Blok — podsumowanie diety na utrzymanie wagi
 */

export function getSummary(calorie: number): string {
  return `Dieta na utrzymanie wagi ${calorie} kcal ma na celu dostarczenie takiej ilości energii, jaka odpowiada Twojemu zapotrzebowaniu — dzięki temu masa ciała pozostaje stabilna.

**Kluczowe zasady:**

✓ Utrzymanie bilansu kalorycznego (kalorie spożyte ≈ kalorie spalone)
✓ Odpowiednia ilość białka (1,2–1,8 g/kg masy ciała)
✓ Zbilansowane makroskładniki (białko, węglowodany, tłuszcze)
✓ Regularne posiłki i kontrola porcji
✓ Aktywność fizyczna
✓ Unikanie nadmiernego podjadania i słodzonych napojów

Jeśli Twoje zapotrzebowanie wynosi około ${calorie} kcal dziennie, ten jadłospis może być dla Ciebie dobrą bazą. W razie wątpliwości [oblicz zapotrzebowanie w kalkulatorze kalorii](/kalkulator-kcal) lub skonsultuj się z dietetykiem.

Więcej porad znajdziesz w artykułach: [dieta na utrzymanie wagi](/dieta/na-utrzymanie-wagi), [dieta na masę](/dieta/na-mase) oraz [dieta na redukcję](/dieta/na-redukcje).`;
}
