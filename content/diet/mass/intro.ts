/**
 * Blok intro — dieta na masę
 * Sekcja: Dla kogo jest odpowiednia?
 */

export function getIntro(calorie: number): string {
  return `${calorie} kcal dziennie to ${
    calorie >= 3500 ? "bardzo wysoka" : calorie >= 2500 ? "wysoka" : "umiarkowana"
  } kaloryczność diety. ${
    calorie >= 3000 ? "Dla większości osób będzie ona przekraczać dzienne zapotrzebowanie energetyczne." : ""
  }

Dieta o takiej wartości energetycznej jest stosowana przede wszystkim przez:
• osoby intensywnie trenujące siłowo,
• sportowców wyczynowych,
• osoby o ${calorie >= 3000 ? "bardzo dużej" : "większej"} masie ciała,
• osoby z ${calorie >= 3000 ? "bardzo wysokim" : "wysokim"} wydatkiem energetycznym (np. ciężka praca fizyczna).

W większości przypadków dieta ${calorie} kcal służy do budowania masy mięśniowej, ponieważ dostarcza nadwyżkę kalorii potrzebną do wzrostu mięśni.

Nie jest to jednak dieta dla każdego.

Dla przykładu: kobieta ważąca 70 kg przy wzroście 170 cm i umiarkowanej aktywności fizycznej potrzebuje około 1800–2000 kcal dziennie, aby utrzymać masę ciała. ${
    calorie >= 2500
      ? `Spożywanie ${calorie} kcal w takim przypadku prowadziłoby do szybkiego przyrostu tkanki tłuszczowej.`
      : ""
  }

Dlatego dieta na masę zawsze powinna być dopasowana indywidualnie do zapotrzebowania kalorycznego organizmu, które możesz obliczyć w [kalkulatorze zapotrzebowania kalorycznego](/kalkulator-kcal).

Aby sprawdzić, czy ta kaloryczność jest dla Ciebie odpowiednia, [oblicz swoje kcal w kalkulatorze kalorii](/kalkulator-kcal).`;
}
