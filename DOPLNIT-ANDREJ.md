# Čaká na doplnenie od Andreja

Zoznam obsahových a konfiguračných placeholderov, ktoré vedome nevymýšľame
(ceny, názvy, čísla, PDF, prístupy). Pri každej položke je **cesta k súboru**
a čo presne treba doplniť. Po doplnení zmaž príslušný riadok.

_Aktualizované: 2026-09-14_

## Obsah (data súbory)

- **Partnerské balíky** — `data/partners.json`
  - `levels[].name` — 4× `"TODO – názov úrovne N"` → skutočné názvy úrovní
  - `levels[].price` — 4× `null` → ceny **bez DPH** (alebo nechať skryté)
  - `features[].values` — matica 7×4 samé `"—"` → čo ktorá úroveň obsahuje
- **Lode – špecifikácie** — `data/boats.json`
  - `dufour_460` a `dufour_470` → všetky `specs` sú `"—"` (dĺžka, šírka, ponor,
    kajuty, lôžka, WC, motor, posádka). BALI 5.2 je vyplnená.
  - `photos: []`, `layout: ""`, `tourUrl: ""` pre všetky lode → fotky (WebP),
    pôdorys kajút, 360° prehliadka
- **Dokumenty (PDF)** — `data/documents.json`
  - všetky `status: "soon"` → po nahratí PDF prepnúť na `"ready"` a vyplniť
    `version`, `date`, `url`
- **Rezervácia – texty** — `app/i18n/sk.ts` (sekcia `reservation`) + 6 mutácií
  - `paymentSteps` — „Výšku a termín doplníme" → konkrétne sumy/termíny zálohy a doplatku
  - `notIncludes` — skontrolovať/doplniť, čo cena **neobsahuje**

## Konfiguračné prepínače (regatta.json)

- **Zverejnenie cien** — `data/regatta.json → pricing.public_display: false`
  - zapnúť na `true` po **15. 10. 2026** (`public_release_date`)
- **Počítadlo obsadenosti flotily** — `data/regatta.json → fleet_occupancy.enabled: false`
  - zapnúť až **po podpise charterovej zmluvy**; potom nastaviť `booked`/`total`
- **ORC rating / hodnotenie** (P0-4) — doplniť, keď prídu od NCP

## E-mail (Resend) — potrebné pre odosielanie e-mailov

E-mailová logika je hotová a **dormant** — spustí sa automaticky, keď pribudnú tajomstvá:
- Založiť Resend účet, overiť doménu (SPF/DKIM/DMARC DNS záznamy pre `tacktalkregatta.com`)
- Nastaviť secrets v Cloudflare: `RESEND_API_KEY`, `EMAIL_FROM` (napr. `info@tacktalkregatta.com`)
- Voliteľne `EMAIL_REPLY_TO` (default `info@tacktalkregatta.com`)
- Po nastavení sa aktivujú: notifikácie o leadoch (interné), potvrdenia žiadateľom
  (prihláška, partnerstvo, rezervácia)

## Súhlasy / právne

- **Profil veliteľa flotily (Michal Hrivnák)** — `data/regatta.json → organization.fleet_commander.public_profile: true`
  - zapnuté, lebo `contract_status` potvrdzuje podpísaný súhlas (2026-08-09).
    Ak by súhlas nebol platný, prepnúť na `false` (skryje sekciu aj hero pill).
