/**
 * Sekcje „Dla przykładu…” pod programmatic SEO.
 * Odwrotne liczenie: z kalorii diety → szacowana waga (kcal/kg przy umiarkowanej aktywności).
 * Użycie: intro redukcja, intro masa (uniwersalne 1500–4000 kcal).
 */

/** kcal na kg masy ciała przy umiarkowanej aktywności (utrzymanie wagi) */
const KCAL_PER_KG_MALE = 31;
const KCAL_PER_KG_FEMALE = 27;
const MAINTENANCE_RANGE = 200;

/** Szacowana waga mężczyzny, dla której dieta o tej kaloryczności to utrzymanie (kcal / 31). */
export function weightMaleFromCalorie(calorie: number): number {
  return Math.round(calorie / KCAL_PER_KG_MALE);
}

/** Szacowana waga kobiety, dla której dieta o tej kaloryczności to utrzymanie (kcal / 27). */
export function weightFemaleFromCalorie(calorie: number): number {
  return Math.round(calorie / KCAL_PER_KG_FEMALE);
}

/** Zakres kcal „utrzymania” w tekście: target ± 200. */
export function maintenanceRange(calorie: number): { min: number; max: number } {
  return {
    min: Math.max(1200, calorie - MAINTENANCE_RANGE),
    max: calorie + MAINTENANCE_RANGE,
  };
}

/** Status w zdaniu: „Dieta X kcal będzie dla niego [status].” — redukcja. */
function getStatusReduction(calorie: number): string {
  if (calorie <= 1800) return "znacznym deficytem kalorycznym";
  if (calorie <= 2200) return "umiarkowanym deficytem kalorycznym";
  if (calorie <= 2600) return "niewielkim deficytem kalorycznym";
  return "blisko zapotrzebowania kalorycznego";
}

/** Status w zdaniu: „Dieta X kcal będzie dla niego/niej [status].” — masa. */
function getStatusMass(calorie: number): string {
  if (calorie <= 2000) return "poniżej zapotrzebowania kalorycznego";
  if (calorie <= 2600) return "zbliżona do zapotrzebowania kalorycznego";
  if (calorie <= 3500) return "nadwyżką kaloryczną";
  return "znaczną nadwyżką kaloryczną";
}

/**
 * Zwraca akapit(y) „Dla przykładu: mężczyzna… / kobieta…” dla diety redukcyjnej.
 * Uniwersalne 1500–4000 kcal, waga i zakres kcal liczone dynamicznie.
 */
export function getExampleParagraphReduction(calorie: number): string {
  const wagaM = weightMaleFromCalorie(calorie);
  const wagaK = weightFemaleFromCalorie(calorie);
  const { min: kcalMinM, max: kcalMaxM } = maintenanceRange(calorie);
  const { min: kcalMinK, max: kcalMaxK } = maintenanceRange(calorie);
  const status = getStatusReduction(calorie);

  return `Dla przykładu: mężczyzna ważący około ${wagaM} kg przy wzroście 180 cm i umiarkowanej aktywności fizycznej potrzebuje około ${kcalMinM}–${kcalMaxM} kcal dziennie, aby utrzymać masę ciała. Dieta ${calorie} kcal będzie dla niego ${status}.

Dla przykładu: kobieta ważąca około ${wagaK} kg przy wzroście 170 cm i umiarkowanej aktywności fizycznej potrzebuje około ${kcalMinK}–${kcalMaxK} kcal dziennie, aby utrzymać masę ciała. Dieta ${calorie} kcal będzie dla niej ${status}.`;
}

/**
 * Zwraca akapit(y) „Dla przykładu: mężczyzna… / kobieta…” dla diety na masę.
 * Uniwersalne 1500–4000 kcal, waga i zakres kcal liczone dynamicznie.
 */
export function getExampleParagraphMass(calorie: number): string {
  const wagaM = weightMaleFromCalorie(calorie);
  const wagaK = weightFemaleFromCalorie(calorie);
  const { min: kcalMinM, max: kcalMaxM } = maintenanceRange(calorie);
  const { min: kcalMinK, max: kcalMaxK } = maintenanceRange(calorie);
  const status = getStatusMass(calorie);

  const sentenceMale =
    calorie <= 2000
      ? `Spożywanie ${calorie} kcal w takim przypadku byłoby poniżej zapotrzebowania — dieta na masę powinna dostarczać nadwyżkę.`
      : `Dieta ${calorie} kcal będzie dla niego ${status}.`;

  const sentenceFemale =
    calorie <= 2000
      ? `Spożywanie ${calorie} kcal w takim przypadku byłoby poniżej lub blisko zapotrzebowania — do budowania masy potrzebna jest nadwyżka kaloryczna.`
      : `Dieta ${calorie} kcal będzie dla niej ${status}.`;

  return `Dla przykładu: mężczyzna ważący około ${wagaM} kg przy wzroście 180 cm i umiarkowanej aktywności fizycznej potrzebuje około ${kcalMinM}–${kcalMaxM} kcal dziennie, aby utrzymać masę ciała. ${sentenceMale}

Dla przykładu: kobieta ważąca około ${wagaK} kg przy wzroście 170 cm i umiarkowanej aktywności fizycznej potrzebuje około ${kcalMinK}–${kcalMaxK} kcal dziennie, aby utrzymać masę ciała. ${sentenceFemale}`;
}
