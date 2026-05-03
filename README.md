# ReactionGame – Zadání samostatného cvičení

**Předmět:** Algoritmizace (Static TypeScript, Micro:bit, MakeCode)  
**Ročník:** 1. ročník  
**Typ:** Samostatné cvičení – funkční aplikace  
**Míra použití AI:** Nízká (pouze pro inspiraci a hledání funkcí (např. kreslení LED), ne pro generování kódu!)

---

## Téma a herní mechanika

Naprogramuj hru pro dva hráče **ReactionGame**, ve které hráči soupeří o nejrychlejší reakci na signál.

Po spuštění hry Micro:bit zobrazí přesýpací hodiny a po náhodné době (3–6 sekund) zobrazí startovní signál. Oba hráči se snaží co nejrychleji stisknout své tlačítko (hráč A tlačítko A, hráč B tlačítko B). Kdo stiskne dřív, vyhrává kolo. Pokud někdo stiskne předčasně (ještě před signálem), je diskvalifikován.

---

## Stavy aplikace

Aplikace se nachází vždy v jednom ze tří stavů:

| Stav | Popis |
|------|-------|
| `Passive` | Výchozí stav. Čeká se na spuštění nového kola. |
| `Started` | Přesýpací hodiny – náhodné čekání před signálem. |
| `Running` | Signál zobrazen – hráči reagují stiskem tlačítka. |

---

## Průběh hry

### Spuštění (Passive → Started)

- Kolo se spustí **stiskem vybraného tlačítka** (např. A+B zároveň, nebo Logo – volba je na tobě).
- Stav se změní na `Started`.
- Zobrazí se ikona **přesýpacích hodin** – kresli ji samostatnou funkcí po jednotlivých LED (`led.plot`).
- Zazní **startovní tón** (na pozadí).
- Vygeneruje se náhodné celé číslo v rozsahu **3 až 6** – to je doba čekání (v sekundách).
- Program čeká po vygenerovanou dobu (`basic.pause`).

### Kontrola falešného startu (Started → Passive / Running)

Po uplynutí čekací doby se zkontroluje, zda některý hráč **stiskl tlačítko předčasně** (pomocí `input.buttonIsPressed`):

| Situace | Výsledek |
|---------|----------|
| Oba stiskli předčasně | Zobrazí se `IconNames.Sad` + tón selhání → oba diskvalifikováni. |
| Pouze A stiskl předčasně | Hráč A je diskvalifikován → vítězí **B** (zobrazí se `"B"` + tón). |
| Pouze B stiskl předčasně | Hráč B je diskvalifikován → vítězí **A** (zobrazí se `"A"` + tón). |
| Nikdo nestiskl | Přechod do stavu `Running`. |

Pokud došlo k diskvalifikaci, stav se vrátí na `Passive`.

### Reakce a vyhodnocení (Running → Passive)

- Zobrazí se ikona **`IconNames.Pitchfork`** (signál „teď!").
- Zazní **signální tón** (na pozadí, odlišný od startovního).
- Program v cyklu kontroluje stav obou tlačítek (`input.buttonIsPressed`).

**Vyhodnocení v každé iteraci cyklu:**

1. Načti stav obou tlačítek do proměnných (`pressedA`, `pressedB`).
2. Vyhodnoť:

| Situace | Výsledek |
|---------|----------|
| `pressedA` i `pressedB` | Remíza – zobrazí se `IconNames.Square` (nebo `"="`) + tón. |
| Pouze `pressedA` | Vítězí hráč **A** – zobrazí se `"A"` + tón úspěchu. |
| Pouze `pressedB` | Vítězí hráč **B** – zobrazí se `"B"` + tón úspěchu. |
| Žádné tlačítko | Pokračuj v cyklu (krátká `pause` pro polling interval). |

> **Důležité:** Oba stavy tlačítek se musí přečíst *před* vyhodnocením podmínek, aby žádný hráč nebyl zvýhodněn pořadím `if` příkazů.

Stav se vrátí na `Passive`.

---

## MakeCode – užitečné části API

### Náhodné celé číslo

```typescript
const waitTime = randint(3, 6)
```

### Kreslení LED po jednotlivých bodech

```typescript
basic.clearScreen()
led.plot(2, 0)   // rozsvítí LED na sloupci 2, řádku 0
led.plot(1, 1)
led.plot(3, 1)
// ... další body pro vzor přesýpacích hodin
```

Displej Micro:bit má rozměr 5×5 (sloupce 0–4, řádky 0–4).

### Polling stavu tlačítka

```typescript
let pressedA = input.buttonIsPressed(Button.A)
let pressedB = input.buttonIsPressed(Button.B)
```

Vrací `true`/`false` podle **aktuálního** stavu tlačítka (stisknuto / nestisknuto).

### Přehrání tónu na pozadí (neblokující)

```typescript
control.runInBackground(() => music.playTone(440, 200))  // 440 Hz, 200 ms
```

Tón se přehraje asynchronně – program pokračuje dál bez čekání.  
Pro různé signály použij různé frekvence, aby byly rozlišitelné.

### Ikony a displej

```typescript
basic.showIcon(IconNames.Pitchfork)   // signál „start"
basic.showIcon(IconNames.Sad)         // diskvalifikace
basic.showIcon(IconNames.Square)      // remíza
basic.showString("A")                 // vítěz A
basic.showString("B")                 // vítěz B
```

### Čekání (blokující)

```typescript
basic.pause(waitTime * 1000)   // pauza v ms
```

### Krátká pauza v polling cyklu

```typescript
basic.pause(50)   // 50 ms – interval pro opakované testování tlačítek
```

---

## Tipy a náročnější části

### Doporučený postup

1. Navrhni stavový automat (tři stavy) a ujasni si přechody mezi nimi.
2. Implementuj zobrazení přesýpacích hodin (naplánuj souřadnice LED).
3. Implementuj náhodné čekání a kontrolu falešného startu.
4. Implementuj polling cyklus pro detekci stisku a vyhodnocení vítěze.
5. Přidej tóny pro rozlišení jednotlivých událostí.
6. Propoj vše dohromady a otestuj hraniční případy (remíza, falešný start obou, jednoho).

### Na co si dát pozor

- **`onButtonPressed` vs `buttonIsPressed`:** `onButtonPressed` je událost, která se spustí při **uvolnění** tlačítka – to je pro reakční hru nevhodné (rozhoduje moment stisku, ne uvolnění). Použij `input.buttonIsPressed()`, který vrací aktuální stav.
- **Férovost vyhodnocení:** V polling cyklu vždy načti oba stavy tlačítek do proměnných *najednou* a teprve poté vyhodnocuj. Pokud bys psal `if (buttonIsPressed(A)) ... else if (buttonIsPressed(B)) ...`, hráč A by byl strukturálně zvýhodněn.
- **Přesýpací hodiny:** Ikonu přesýpacích hodin nelze zobrazit pomocí `showIcon` – musíš ji nakreslit bod po bodu (`led.plot`). Naplánuj si souřadnice na papíře (mřížka 5×5).
- **Blokující vs. neblokující volání:** `basic.pause()` zablokuje vlákno – to je žádoucí pro čekací dobu, ale v polling cyklu potřebuješ jen krátkou pauzu (např. 50 ms), aby cyklus nebyl příliš náročný na procesor.
- **Falešný start:** Kontrolu provádíš *jednou* po uplynutí čekací doby. Stačí zavolat `buttonIsPressed` pro obě tlačítka a rozhodnout.
- **Polling interval:** Příliš krátký interval (< 10 ms) zbytečně zatěžuje procesor. Příliš dlouhý (> 100 ms) snižuje přesnost detekce stisku. Vhodný kompromis je 20–50 ms.

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
