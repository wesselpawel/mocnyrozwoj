export type MealIngredient = {
  produkt: string;
  ilosc_g: number;
};

export type PlanPosilku = {
  nazwa_posilku: string;
  godzina: string;
  skladniki: MealIngredient[];
  kalorie_kcal: number;
  bialko_g: number;
  tluszcze_g: number;
  weglowodany_g: number;
};

export type ListaZakupowItem = {
  produkt: string;
  ilosc_calkowita_g: number;
  kalorie_kcal: number;
};

export type Przepis = {
  nazwa_posilku: string;
  skladniki: MealIngredient[];
  kroki: string[];
};

export type AnalizaDiety = {
  porady_dla_ciebie?: string[];
  czego_unikac?: string[];
  najczestsze_bledy?: string[];
};

export type DietPlanData = {
  plan_dnia?: PlanPosilku[];
  lista_zakupow?: ListaZakupowItem[];
  przepisy?: Przepis[];
  analiza?: AnalizaDiety;
};
