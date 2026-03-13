# Programmatic SEO — Plan i struktura plików

## Zasada

**1 template + dane = setki stron**

- Nie tworzysz setek plików artykułów.
- Tworzysz: **szablon** + **dane (JSON/zmienne)** → **generowane strony**.

---

## Architektura katalogów

```
programmatic/
├── index.ts                    # Centralny loader — zbiera wszystkie generatory
├── types.ts                    # Wspólne typy (DietPageParams, MealPageParams, …)
│
├── diet/
│   ├── data.ts                 # Zmienne: kalorie, cele, posiłki, (opcjonalnie dni)
│   ├── generator.ts            # Generuje wszystkie kombinacje stron diet
│   └── template.ts             # Wybiera template celu → zwraca dane do strony
│
├── meals/                      # [Faza 2]
│   ├── data.ts
│   ├── generator.ts
│   └── template.ts
│
└── diseases/                   # [Faza 3]
    ├── data.ts
    ├── generator.ts
    └── template.ts
```

```
content/
└── diet/
    ├── mass/                   # Treści dla celu "masa"
    │   ├── intro.ts
    │   ├── products.ts
    │   ├── mistakes.ts
    │   └── ... (inne bloki)
    ├── reduction/               # Treści dla celu "redukcja"
    │   ├── intro.ts
    │   ├── products.ts
    │   ├── mistakes.ts
    │   └── ...
    └── maintenance/            # Treści dla celu "utrzymanie wagi"
        ├── intro.ts
        ├── products.ts
        ├── mistakes.ts
        └── ...
```

**Strona dynamiczna (Next.js App Router):**

```
app/(with-nav)/dieta/
└── [slug]/
    └── page.tsx                # getStaticParams + render z template
```

---

## Diet — zmienne i kombinacje

| Zmienna   | Przykład wartości                    | Uwagi                          |
|----------|--------------------------------------|---------------------------------|
| `calories` | 1500, 1800, 2000, 2200, 2500, 3000… | Z `data.ts`                     |
| `goals`    | redukcja, masa, utrzymanie           | Każdy cel = inny template       |
| `meals`    | 3, 4, 5                              | Liczba posiłków                 |
| `levels`   | (opcjonalnie) początkujący, średnioz. | Do rozbudowy                    |

**Przykład skali:** 10 kcal × 3 cele × 3 posiłki = **90 stron**.  
Z dniami (np. 7, 14, 28): nawet **200–800 stron**.

---

## Hybryda: programmatic + warianty treści

- **Programmatic** = te same zmienne (kcal, posiłki, dni).
- **Różna semantyka** = osobne bloki treści dla **masa / redukcja / utrzymanie**.

Generator:
1. Tworzy kombinacje (kcal, cel, posiłki, …).
2. Dla każdego `goal` wybiera **template celu** (mass / reduction / maintenance).
3. Składa artykuł z **content blocks** (intro, products, mistakes, …) + wstawia liczby (kcal, posiłki).

Dzięki temu Google widzi inne słownictwo i porady per cel, a nie tylko podmianę jednego słowa.

---

## Co trzeba zaimplementować (checklist)

### Faza 1 — Diet (dieta × kcal × cel)

- [ ] **programmatic/types.ts** — typy `DietPageParams`, `DietPageData`, ewent. `GoalSlug`.
- [ ] **programmatic/diet/data.ts** — tablice: `calories`, `goals`, `meals` (i opcjonalnie `levels`, `days`).
- [ ] **content/diet/mass/** — bloki: `intro`, `products`, `mistakes` (min. te 3).
- [ ] **content/diet/reduction/** — to samo.
- [ ] **content/diet/maintenance/** — to samo.
- [ ] **programmatic/diet/template.ts** — funkcja `getDietTemplate(goal)` zwracająca zestaw bloków (mass/reduction/maintenance) + funkcja `dietTemplate(data)` zwracająca `{ title, h1, description, sections }`.
- [ ] **programmatic/diet/generator.ts** — `generateDietPages()` zwracające listę `{ slug, calorie, goal, meal, ... }`.
- [ ] **programmatic/index.ts** — `generateAllPages()` łączące `generateDietPages()` (później + meals, diseases).
- [ ] **app/(with-nav)/dieta/[slug]/page.tsx** — `generateStaticParams` z generatora, `generateMetadata` z template, strona renderująca sekcje z template.

### Faza 2 — Meals (posiłek × kcal)

- [ ] **programmatic/meals/data.ts** — np. typy posiłków (śniadanie, obiad, kolacja), przedziały kcal (300, 400, 500, 600).
- [ ] **programmatic/meals/generator.ts** — kombinacje np. `/posilek/obiad-500-kcal`.
- [ ] **programmatic/meals/template.ts** — szablon treści dla posiłku + kcal.
- [ ] **content/meals/** — (opcjonalnie) bloki per typ posiłku.
- [ ] **app/(with-nav)/posilek/[slug]/page.tsx** — strona dynamiczna.
- [ ] **programmatic/index.ts** — dodać `generateMealPages()` do `generateAllPages()`.

### Faza 3 — Diseases (dieta przy schorzeniach)

- [ ] **programmatic/diseases/data.ts** — lista schorzeń (insulinooporność, hashimoto, cukrzyca, PCOS, …).
- [ ] **programmatic/diseases/generator.ts** — slugi np. `/dieta-przy-insulinoopornosci`.
- [ ] **programmatic/diseases/template.ts** — szablon per schorzenie (lub jeden szablon z blokami).
- [ ] **content/diseases/** — bloki treści per schorzenie (opcjonalnie).
- [ ] **app/(with-nav)/dieta-przy-[slug]/page.tsx** lub odpowiedni segment.
- [ ] **programmatic/index.ts** — dodać `generateDiseasePages()`.

### Wspólne

- [ ] **Slugowanie** — jedna funkcja do tworzenia slugów (np. `2000-kcal-redukcja-4-posilki`) i parsowania z powrotem do `DietPageParams`.
- [ ] **Sitemap** — uwzględnienie URL-i programmatic w `app/sitemap.ts` (jeśli istnieje).
- [ ] **Internal linking** — opcjonalnie: linki między dietami (np. „Zobacz też: 2000 kcal na masę”).

---

## Warianty do zaimplementowania (podsumowanie)

| Element | Warianty |
|--------|----------|
| **Cele diet** | masa, redukcja, utrzymanie (3 template’y treści) |
| **Bloki treści per cel** | intro, products, mistakes (min.); można dodać more blocks |
| **Kalorie** | lista z data.ts (np. 8–12 przedziałów) |
| **Posiłki** | 3, 4, 5 (z data.ts) |
| **Opcjonalnie: dni** | 7, 14, 28 → więcej kombinacji |
| **Opcjonalnie: warianty tekstu** | introA / introB / introC i losowanie w generatorze |

Po zatwierdzeniu tej struktury można przejść do implementacji kodu (zaczynając od Fazy 1 — diet).

---

## Integracja z blogiem (kategoria Diety)

Programmatic diet pages są **równocześnie wpisami w blogu** w kategorii „Diety”:

1. **`lib/publicBlogEntries.ts`**  
   - `getProgrammaticDietEntries()` zamienia każdą kombinację z `generateDietPages()` + `getDietTemplateData()` na `PublicBlogEntry` (category: `"Diety"`, slug, title, description, `sections`).  
   - W `getPublicBlogEntries()` kolejność: wpisy statyczne → wpisy programmatic (diety) → wpisy z Firebase (DB nadpisuje po slug).

2. **`PublicBlogEntry`**  
   - Ma opcjonalne pole `sections?: { title: string; text: string }[]`.  
   - Dla wpisów programmatic używane są `sections` z template’u; `content` jest uzupełniane na potrzeby readTime i kompatybilności.

3. **`app/(with-nav)/blog/post/[slug]/page.tsx`**  
   - `generateStaticParams` korzysta z `getPublicBlogEntries()`, więc wszystkie slugi diet (np. `2000-kcal-redukcja-4-posilki`) są pre-renderowane.  
   - Jeśli `entry.sections` istnieje, treść jest renderowana jako sekcje (h2 + tekst); w przeciwnym razie używane jest `entry.content` jak dotąd.

Efekt: w **Blog → Diety** pojawiają się dziesiątki artykułów typu „Dieta 2000 kcal na redukcję” (4 posiłki), „Dieta 2500 kcal na masę” (5 posiłków) itd., każdy z unikalnym slugiem i treścią z template’u.

---

## Podsumowanie: co mamy vs. co dopisać

| Gotowe | Do zrobienia |
|--------|----------------|
| `programmatic/` (types, diet/data, diet/generator, diet/template, index) | Rozbudowa content blocks (więcej sekcji, warianty A/B) |
| `content/diet/{mass,reduction,maintenance}` (intro, products, mistakes + index) | Faza 2: meals (data, generator, template, strona `/posilek/[slug]`) |
| Strona `app/(with-nav)/dieta/[slug]/page.tsx` | Faza 3: diseases (data, generator, template, strona) |
| Slugi i parsowanie (`dietParamsToSlug`, `slugToDietParams`) | Sitemap: dodać URL-e z `generateAllPages()` |
| 3 warianty treści per cel (masa / redukcja / utrzymanie) | Opcjonalnie: dni (7/14/28), levels (początkujący/średniozaawansowany) |
| **Blog – kategoria Diety** | ✅ Wpisy programmatic w `getPublicBlogEntries()`; render sekcji w `/blog/post/[slug]` |
| | Opcjonalnie: losowanie wariantów intro (introA/B/C) dla większej różnorodności |
