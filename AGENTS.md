# Tack & Talk Regatta 2027 — projektový kontext

Tento súbor je kontext pre AI agenta pracujúceho na projekte. Obsahuje pravidlá, ktoré nie sú vyčítateľné z dát.

## Čo je projekt

Firemná plachtárska regata s biznis programom. 20 lodí, približne 120 účastníkov a 5 nocí v chorvátskej Dalmácii,
25. — 30. 9. 2027, východisko Marina Frapa v Rogoznici. Štyri súťažné dni, deväť rozjázd.

Hlavný organizátor: **AJservices, s.r.o.** · Spoluorganizátor: **Tangreto, s.r.o.**
Veliteľ flotily a hlavný rozhodca: **Michal Hrivnák**

Všetky štruktúrované dáta sú v `data/regatta.json`. Trasa aj v `data/route.gpx`.

## Jazyk

Projekt je **slovenský**. Všetky výstupy pre účastníkov, web, materiály a komunikáciu píš po slovensky.
Anglické sú len názov podujatia (*Tack & Talk Regatta*) a interné technické identifikátory.
Claim je slovenský: *Svieži vietor v plachtách*.

## Zdroj pravdy a priorita

1. `data/regatta.json` — čísla, termíny, trasa, ceny, pravidlá
2. tento súbor — princípy a kontext
3. PDF dokumenty (plachtárske inštrukcie v2.0, predajný plán v2.0)

Ak si dáta protirečia, platí `regatta.json`. Nikdy needituj čísla „od oka" — ak niečo nesedí, oznám to, needituj.

## Tvrdé pravidlá — neporušovať

### Bezpečnosť má vždy prednosť pred súťažou
Akýkoľvek výstup, ktorý sa dotýka priebehu plavby, musí rešpektovať `safety_rules` v JSON.
Nikdy negeneruj obsah, ktorý motivuje posádku plávať v nevhodných podmienkach, plávať v noci,
alebo tlačí na výkon proti opatrnosti. Princíp **„za opatrnosť sa netrestá"** je konštrukčný prvok,
nie fráza — v bodovaní má oporu v `scoring.sailing.safety_retirement`.

### Súradnice nie sú navigačné dáta
`route.gpx` a súradnice v JSON sú **orientačné, na plánovanie**. Nikdy ich neprezentuj ako navigačné.
Každý výstup obsahujúci súradnice musí niesť poznámku, že pred plavbou treba overiť oficiálne námorné mapy.

### Cena je zamrznutá
`pricing.locked = true`. Dufour 460 stojí 8 700 € bez DPH a Dufour 470 stojí 9 500 € bez DPH.
Pri každom verejnom uvedení ceny musí byť výslovne napísané **bez DPH**. Po 28. 2. 2027 sa cena neznižuje za žiadnych okolností
(`pricing.no_discount_rule`). Ak generuješ predajné texty, nikdy nenavrhuj ad-hoc zľavu
ani formuláciu typu „ozvite sa, dohodneme sa na cene". Dopredáva sa obsahom balíčka, nie cenou.

### Meno Michala Hrivnáka
Písomná zmluva a súhlas s použitím mena a fotografie sú podpísané; organizátor to potvrdil 9. 8. 2026.
Vo verejných materiáloch používaj iba fakty uvedené v `organization.fleet_commander.bio` a v jeho
oficiálnom profile na Tangreto. Nevymýšľaj mu životopis, referencie ani zásluhy.

### Predaj pred podpisom zmluvy
Do podpisu charterovej zmluvy (12/2026) sa komunikuje **koncept a príprava**, nie garantovaná kapacita.
Formulácia „pripravujeme" je v poriadku, „prihláste sa" nie. Toto vyplýva z `decisions_confirmed[3]`.

### Právna neistota
`open_items[A]` — nie je vyriešené, či predaj balíčka spadá pod slovenský zákon o zájazdoch.
Negeneruj obchodné podmienky, zmluvy ani prihlasovacie formuláre, kým to nie je posúdené právnikom.
Ak o tom píšeš, uveď to ako otvorenú otázku, nie ako vyriešenú.

## Konštrukčné princípy — prečo je to postavené takto

Ak navrhuješ zmeny, rešpektuj dôvody, nie len čísla.

**Bodovanie 50/50 medzi plavbou a obsahom.** Keby rozhodovala len plavba, vyhrá eskadra, ktorá má
náhodou dvoch skúsených jachtárov, a zvyšných 96 ľudí stratí motiváciu v stredu.

**Škrtaná etapa.** Jeden zlý deň nesmie zlikvidovať týždeň — posádky, ktoré stratia nádej v utorok,
prestanú hrať aj v obsahovej časti.

**Eskadry po 4 lodiach.** 120 anonymných ľudí sa nezoznámi. 5 identít po 24 ľuďoch sa zoznámi
a zároveň súperí. Toto robí z výletu podujatie.

**Predaj celých lodí, nie miest.** 20 obchodov namiesto 120. Firemný rozpočet, jeden rozhodovateľ,
posádka príde hotová a zohratá.

**BALI 5.2 je spoločný networkingový priestor.** Katamarán je zahrnutý v cene, pláva s flotilou počas celého podujatia
a slúži na stretnutia účastníkov naprieč posádkami.

**Model 12+8.** Znižuje záväzok pri decembrovej zálohe. Opcia sa uplatňuje až keď je predaj potvrdený.

**Kontrola 8 lodí k 30. 11. 2026.** Nie je to test likvidity (strop vlastných peňazí je 50 000 €,
záloha ~33 000 €), ale **test dopytu**. Ak osem lodí v novembri nie je, problém je v koncepte alebo cene.

## Čo môžeš generovať

- Predajné a marketingové texty (SK), LinkedIn príspevky, e-mailové sekvencie
- Webové stránky a landing pages podľa `branded_assets.design_system`
- Kalkulačky rozpočtu, scenáre naplnenia flotily, cash-flow modely
- Bodovacie skripty a výsledkové tabuľky podľa `scoring`
- Checklisty, harmonogramy, prezentácie
- Vizualizácie trasy (s disclaimerom)

## Čo negeneruj bez výslovného pokynu

- Zmluvy, obchodné podmienky, právne dokumenty (viď `open_items[A]`)
- Navigačné podklady prezentované ako použiteľné na mori
- Životopis alebo referencie Michala Hrivnáka
- Akékoľvek zľavy nad rámec `pricing.discounts`

## Vizuálna identita

Fonty: Poppins (300/400/500/700).
Farby: navy `#0B2545`, mosadz `#C08A2E`, piesok `#F6F2E9`, tmavá modrá `#13395E`,
červená `#9E2A2B`, zelená `#1F6B4A`, sivá `#5A6472`, linka `#D8DEE6`.
V logotype je mosadzný len ampersand, zvyšok biely na navy podklade.

## Stav dát

Verzia dokumentu 2.0, generované 8. 8. 2026.
Ceny a konverzie sú **modelové odhady**, nie potvrdené ponuky — viď `budget.disclaimer`.
Tiesňové čísla a pravidlá NP Kornati treba overiť pred tlačou.
