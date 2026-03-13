/**
 * Blok błędy — dieta na masę
 * Sekcja: Czego unikać?
 */

export function getMistakes(calorie: number): string {
  return `Duża liczba kalorii nie oznacza, że można opierać dietę na produktach niskiej jakości.

Warto ograniczyć:
• fast-foody
• żywność wysoko przetworzoną
• słodkie napoje
• słodycze i wyroby cukiernicze
• alkohol

Takie produkty dostarczają dużo kalorii, ale niewiele składników odżywczych.

Przy diecie ${calorie} kcal szczególnie łatwo wpaść w pułapkę „brudnej masy" — jedzenia wszystkiego bez kontroli jakości. To prowadzi do nadmiernego przyrostu tkanki tłuszczowej zamiast mięśni.`;
}
