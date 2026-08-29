import type { Dict } from "./sk";

// Magyar szótár. Ugyanazok a kulcsok, mint az sk.ts-ben (a Dict típus kényszeríti ki).
const hu: Dict = {
  htmlLang: "hu",
  meta: {
    title: "Tack & Talk Regatta 2027 – céges vitorlásregatta Horvátországban",
    description:
      "Céges regatta Horvátországban 20 legénységnek – négy versenynap a vízen és üzleti program a parton. Tack & Talk Regatta 2027, Rogoznica, 2027. szeptember 25–30.",
    keywords: [
      "céges regatta",
      "üzleti regatta",
      "céges csapatépítés vitorlázás",
      "céges vitorlázás",
      "regatta Horvátország",
      "céges rendezvény",
      "vitorlázás cégeknek",
      "csapatépítés Horvátország",
    ],
    ogLocale: "hu_HU",
    ogImageAlt: "Tack & Talk Regatta 2027 — Friss szél a vitorlákban",
    eventDescription:
      "Céges regatta négy versenynappal és kilenc futammal. Öt éjszaka a horvátországi Dalmáciában 20 céges legénységnek.",
  },
  nav: {
    koncept: "Koncepció",
    preKoho: "Kinek szól",
    trasa: "Útvonal és program",
    pocasie: "Időjárás",
    faq: "GYIK",
    kontakt: "Kapcsolat",
    mainAria: "Fő navigáció",
    menu: "Menü",
    mobileAria: "Mobil navigáció",
    brandUpAria: "Tack & Talk - fel",
  },
  hero: {
    eyebrow: "Üzleti regatta · Dalmácia 2027",
    h1Line1: "Friss szél",
    h1Line2Pre: "a ",
    h1Em: "vitorlákban.",
    lead:
      "Öt éjszaka. Négy nap a vízen. Húsz céges legénység és tartalom, amely a kikötőbe való visszatérés után is folytatódik.",
    patronage: "Michal Hrivnák védnökségével",
    ctaConcept: "Koncepció megtekintése",
    ctaRoute: "Útvonal és program",
    cardKicker: "Rogoznica · Horvátország",
    cardDate: "szept. 25–30.",
    statBoats: "hajó",
    statPeople: "fő",
    statRaces: "futam",
    note: "A koncepció és a flotta előkészületben",
    videoTitle: "Vitorlázás a tengeren",
    visualAria: "A regatta legfontosabb adatai",
  },
  statusStrip: {
    line1: "A projekt előkészítés alatt",
    line2: "A nyilvános regisztráció csak a szerződéses és jogi megerősítés után nyílik meg.",
  },
  koncept: {
    eyebrow: "Nem csapatépítés. Közös kihívás.",
    h2: "A tengeren egy cég szűrő nélkül mutatja meg magát.",
    lead:
      "Kis tér, változó körülmények és világos cél. A regatta a sportos fegyelmet olyan tartalommal ötvözi, amely a visszatérés után is folytatódik.",
    card1Label: "A vízen",
    card1H3: "Egységes flotta, tisztességes játék.",
    card1P:
      "Kilenc futam, két hajóosztály és egy közös rajtvonal. Az óvatos döntést soha nem büntetjük.",
    card1Ratio: "futam",
    card2Label: "A parton",
    card2H3: "Valódi problémák, nem névjegykártyák.",
    card2P:
      "Esti beszélgetések, workshop és irányított networking. A program azokra a problémákra épül, amelyekkel a cégek valóban szembesülnek.",
    card2Ratio: "tartalmi blokk",
    whoKicker: "Ki szervezi",
    whoPre: "A rendezvényt az ",
    whoLink: "AJservices, s.r.o.",
    whoPost:
      " készíti fő szervezőként, a Tangreto, s.r.o. társszervezővel együttműködve, Michal Hrivnák flottaparancsnok védnökségével.",
  },
  audience: {
    eyebrow: "Kinek szól",
    h2: "Olyan csapatoknak, amelyek együtt döntenek.",
    lead:
      "A Tack & Talk nem céges kirándulás. Öt éjszaka, amely alatt egy céges csapat együtt dolgozik, vitorlázik és dönt egy nappali méretű térben. Senki sem szökik el egy hívásra. Senki sem tűnik el a második fogás után.",
    cards: [
      {
        h3: "Cégvezetés és menedzsmentcsapatok",
        p: "Olyanoknak, akik együtt hoznak döntéseket, de ritkán van négy napjuk, hogy végiggondolják őket.",
      },
      {
        h3: "Értékesítési és projektcsapatok",
        p: "Ahol az eredmény az összeszokottságon múlik, és ahol érdemes látni, hogyan viselkedik a csapat nyomás alatt, az irodán kívül.",
      },
      {
        h3: "Cégek, amelyek ügyfeleket és partnereket látnak vendégül",
        p: "Egy hajó tér a beszélgetésekre és egy közös élményre, amely a visszatérés után is folytatódik.",
      },
    ],
    summaryPre: "Egy cég ",
    summaryStrong: "egy legénységet alkot egy hajón",
    summaryPost:
      ". Az ajánlott csapat a választott hajótól függően négy–tíz főből áll.",
    noNeedAria: "Mire nincs szükség a részvételhez",
    noNeed: [
      {
        title: "Vitorlázási tapasztalat",
        desc: "A cég hozhatja saját skipperét, vagy kérhet ajánlást.",
      },
      {
        title: "Sportos erőnlét",
        desc: "A vitorlázás a nap egy részét veszi igénybe; a többi a programé és a horgonyzóhelyé.",
      },
      {
        title: "Saját hajó",
        desc: "A hajót a cég maga biztosítja a megerősített specifikáció szerint.",
      },
    ],
  },
  route: {
    eyebrow: "Útvonal · 5 éjszaka · 4 versenynap · 9 futam",
    h2Line1: "Öt pont.",
    h2Line2: "Négy nap.",
    lead:
      "Rogoznica, Tribunj, Jezera, Zlarin és vissza a Marina Frapába. Válassz egy pontot a térképen, és megjelenik a napi program.",
    mapAria: "Sematikus interaktív útvonaltérkép",
    mapInstruction: "Válassz 1 – 5 pontot",
    mapTitle: "A TACK & TALK REGATTA 2027 útvonala",
    mapDesc:
      "Sematikus útvonal Rogoznicából Tribunjon, Jezerán és Zlarinon át vissza Rogoznicába. Öt interaktív pont nyitja meg a napi tervet.",
    disclaimer:
      "A sematikus térkép csak a program bemutatására szolgál. Nem navigációs alap. Vitorlázás előtt az útvonalat hivatalos tengeri térképeken és hajózási kalauzokban kell ellenőrizni.",
    baseEyebrow: "Bázis",
    baseName: "Marina Frapa",
    baseP: "Rogoznica, Horvátország. Húsz hajó és körülbelül 120 résztvevő.",
    ol: [
      { strong: "Rogoznica", span: "hajóátvétel" },
      { strong: "Tribunj", span: "1. versenynap" },
      { strong: "Jezera", span: "2. versenynap" },
      { strong: "Zlarin", span: "3. versenynap" },
      { strong: "Rogoznica", span: "döntő és díjátadó" },
    ],
    safetyStrong: "Az óvatosságot nem büntetjük.",
    safetySpan:
      "A flottaparancsnok lemondhat egy szakaszt vagy módosíthatja az útvonalat. Az éjszakai vitorlázás tilos.",
  },
  program: {
    eyebrow: "Napi terv",
    h2: "Négy nap. Kilenc futam.",
    lead:
      "A pontos napi menetrendet (R1–R9) a versenyutasítások teszik közzé. Itt csak a megerősített útvonalat és a program keretét mutatjuk be.",
    tabsAria: "Válassz programnapot",
    arrivalTag: "Érkezés",
    regataTag: "Regatta",
    factsAria: "A nap tényei",
    raceStatusLabel: "futam négy versenynap alatt",
    raceStatusP:
      "Az egyes napok futamainak számát és pályáit a versenyutasítások erősítik meg. A flottaparancsnok biztonsági döntése mindig elsőbbséget élvez.",
    shoreLabel: "Program a parton",
  },
  days: {
    arrival: {
      tab: "Érkezés",
      destination: "Rogoznica",
      title: "Rogoznica",
      route: "Marina Frapa · a flotta érkezése",
      programme:
        "Hajóátvétel és -ellenőrzés a szervező segítségével, skipper-eligazítás és a rendezvény megnyitója.",
      facts: ["Hajóátvétel", "Szervezői ellenőrzés", "Vacsora 1/5"],
      eveningTitle: "Megnyitó est",
      eveningCopy:
        "Az első közös vacsora és a legénységek találkozója a versenyrész kezdete előtt.",
      mapSub: "1. éjszaka · érkezés",
    },
    day1: {
      tab: "1. nap",
      destination: "Tribunj",
      title: "Rogoznica → Tribunj",
      route: "Első versenynap",
      programme:
        "Reggeli, reggeli eligazítás és a regatta első része Tribunj céllal. A pontos futammenetrendet a versenyutasítások teszik közzé.",
      facts: ["Versenynap 1/4", "Reggeli 1/4", "Vacsora 2/5"],
      eveningTitle: "Tribunj",
      eveningCopy:
        "Közös vacsora és tér a legénységek közötti beszélgetésekre az első versenynap után.",
      mapSub: "1. nap",
    },
    day2: {
      tab: "2. nap",
      destination: "Jezera",
      title: "Tribunj → Jezera",
      route: "Második versenynap",
      programme:
        "Reggeli, reggeli eligazítás és a versenyprogram a Jezera felé vezető útvonalon. A pontos futammenetrendet a versenyutasítások teszik közzé.",
      facts: ["Versenynap 2/4", "Reggeli 2/4", "Vacsora 3/5"],
      eveningTitle: "Jezera",
      eveningCopy:
        "Közös vacsora és találkozók a flottán belül, beleértve a BALI 5.2 fedélzetén zajló programot.",
      mapSub: "2. nap",
    },
    day3: {
      tab: "3. nap",
      destination: "Zlarin",
      title: "Jezera → Zlarin",
      route: "Harmadik versenynap",
      programme:
        "Reggeli, reggeli eligazítás és a versenyprogram Zlarin céllal. A pontos futammenetrendet a versenyutasítások teszik közzé.",
      facts: ["Versenynap 3/4", "Reggeli 3/4", "Vacsora 4/5"],
      eveningTitle: "Zlarin",
      eveningCopy:
        "Az egész flotta összegyűlik a közös vacsorára és programra a harmadik versenynap után.",
      mapSub: "3. nap",
    },
    day4: {
      tab: "4. nap",
      destination: "Rogoznica",
      title: "Zlarin → Rogoznica",
      route: "Utolsó versenynap",
      programme:
        "Reggeli, reggeli eligazítás és a regatta záró része, visszatéréssel a rogoznicai Marina Frapába.",
      facts: ["Versenynap 4/4", "Reggeli 4/4", "Vacsora 5/5"],
      eveningTitle: "Döntő Rogoznicában",
      eveningCopy: "A záró közös vacsora és a regatta eredményeinek kihirdetése.",
      mapSub: "4. nap · döntő",
    },
  },
  safety: {
    eyebrow: "Első számú szabály",
    h2: "A biztonság elsőbbséget élvez a versennyel szemben.",
    lead:
      "Az óvatosságot nem büntetjük. A biztonsági feladás az eddigi szakaszok átlagát jelenti, nem vereséget.",
    rules: [
      { id: "5.1", rule: "Éjszakai vitorlázás tilos" },
      {
        id: "5.2",
        rule:
          "25 csomó feletti szél — a szakaszt a flottaparancsnok lemondja, áthelyezés konvojban, motorral",
      },
      {
        id: "5.3",
        rule:
          "Mentőmellény kötelező éjszaka, 20 csomó felett, MOB esetén, valamint úszni nem tudóknak és gyermekeknek",
      },
      {
        id: "5.4",
        rule:
          "Zéró alkoholtolerancia a kapitánynál és a kormányosnál vitorlázás közben",
      },
    ],
  },
  patronage: {
    badge: "Védnökségével",
    photoAlt: "Michal Hrivnák a kormánynál",
    eyebrow: "Tapasztalat a kormánynál",
    name: "Michal Hrivnák",
    p1:
      "A Tangreto alapítója hatévesen, szlovák tavakon kezdett vitorlázni, és 2003 óta jár nyílt tengeren. 2013 óta foglalkozik regattákkal, a Tangretót 2014-ben alapította.",
    p2:
      "Hivatalos profilja szerint több mint 30 000 tengeri mérföld van mögötte. A Tack & Talk Regatta 2027 az ő védnökségével készül.",
    profileLink: "Hivatalos profil a Tangretón",
  },
  fees: {
    eyebrow: "Hajók és csomag",
    h2Line1: "Két hajó.",
    h2Line2: "Teljes csomag.",
    lead:
      "A csomag tartalmazza a teljes hajót, a kaució-biztosítást, a díjakat, az étkezést, a regattát és a közös BALI 5.2 katamaránt. A hajóárakat 2026. október 15-én tesszük közzé.",
    card1Label: "Dufour 460",
    card1H3: "Teljes hajó egy céges legénységnek.",
    card1P: "Egy ár hajónként és a rendezvény szolgáltatásainak megerősített köre.",
    card2Label: "Dufour 470",
    card2H3: "Több tér. Ugyanaz a program.",
    card2P: "Egy ár hajónként és a rendezvény szolgáltatásainak megerősített köre.",
    priceLabel: "Árak",
    priceStrong: "A hajóárakat 2026. október 15-én tesszük közzé.",
    priceP:
      "Addig a koncepciót, az útvonalat és a csomag tartalmát kommunikáljuk. Hagyd meg lent az elérhetőségedet, és jelentkezünk.",
    includesLabel: "Minden hajó ára tartalmazza",
    includesAria: "Mit tartalmaz minden hajó ára",
    includes: [
      "a teljes hajót",
      "a kaució-biztosítást és a díjakat",
      "a hajóátvételi ellenőrzést és a szervező segítségét",
      "öt közös vacsorát",
      "négy reggelit",
      "a regattát: négy versenynap és kilenc futam",
      "a BALI 5.2 katamaránt a rendezvény teljes ideje alatt",
    ],
    includesNote: "A pontos hajóárakat 2026. október 15-én tesszük közzé.",
    baliEyebrow: "Az árban · végig a flottával",
    baliH3: "Igyál egy kávét a riválisokkal a BALI 5.2 Lumiere fedélzetén.",
    baliP:
      "A közös katamarán minden hajó árában benne van. A rendezvény teljes ideje alatt teret ad a legénységek közötti találkozásoknak, a reggeli kávénak és a kikötőbe való visszatérés utáni beszélgetéseknek.",
    baliSpecsAria: "A BALI 5.2 Lumiere katamarán adatai",
    baliSpecs: {
      year: "Év",
      length: "Hossz",
      beam: "Szélesség",
      capacity: "Kapacitás",
      cabinsWc: "Kabin / WC",
      engines: "Motorok",
      lengthVal: "15,9 m",
      beamVal: "8,15 m",
      capacityVal: "12 fő",
    },
    baliFeatures:
      "Flybridge · légkondicionálás · generátor · víztisztító · kávégép",
    baliPhotoAlt: "BALI 5.2 katamarán vitorlázás közben a tengeren",
    baliCaption: "Promófotó · BALI Catamarans",
  },
  faq: {
    eyebrow: "Gyakori kérdések",
    h2: "Amit kifutás előtt tudni kell.",
    lead:
      "A válaszok az előkészületben lévő rendezvényformátumra vonatkoznak. A technikai és szerződéses feltételeket a jelentkezés megnyitása előtt egészítjük ki.",
    items: [
      {
        q: "A legénységben senki sem vitorlázott még. Részt vehetünk?",
        a: "Igen. A hajóhoz profi skippert rendelhetsz, aki egész héten irányít, tanít és felel a biztonságos vitorlázásért. A profi skipperek kapacitása korlátozott, ezért érdemes előre biztosítani egyet.",
      },
      {
        q: "Ki vezetheti a hajót?",
        a: "Minden hajón kell lennie egy Horvátországban elismert, érvényes hajóvezetői engedéllyel és a VHF tengeri rádió kezelésére való jogosultsággal rendelkező személynek. A konkrét dokumentumokat a charter cég ellenőrzi a hajó átadása előtt.",
      },
      {
        q: "Hogyan működik a skipperrel?",
        a: "A skipper egy profi kapitány, aki a navigációról, a manőverekről és a biztonságról gondoskodik. A fedélzeten alszik, és a legénység része. A szerződést a cég közvetlenül a skipperrel köti; a szervező nem szerződő fél.",
      },
      {
        q: "Hogyan jutunk el Rogoznicába?",
        a: "A legközelebbi repülőtér Splitben van. A közlekedést minden cég maga szervezi; nagyobb érdeklődés esetén segítünk közös utazást összehangolni.",
      },
      {
        q: "Biztonságos?",
        a: "A biztonság elsőbbséget élvez a versennyel szemben. Éjszaka nem vitorlázunk; 25 csomó feletti előrejelzés esetén a flottaparancsnok lemondja a szakaszt, és a flotta konvojban halad. Minden hajó jelentkezik a közös VHF-csatornán. Az a kapitány, aki biztonsági okokból nem fut ki, nem veszít pontot; az addigi eredményeinek átlagát kapja.",
      },
      {
        q: "Milyen az időjárás szeptember végén?",
        a: "Jellemzően 22 °C körüli tengervíz-hőmérséklet és nagyjából 22–26 °C-os nappali levegő várható, hűvösebb estékkel. A tényleges körülmények változhatnak, és a vitorlázási terv mindig alkalmazkodik hozzájuk.",
      },
      {
        q: "Hogyan zajlik valójában a verseny?",
        a: "A kilenc futam alacsonypontos rendszert használ. A Dufour 460 és a Dufour 470 egy vonalon rajtol; az összetett sorrend a számított időből adódik.",
      },
      {
        q: "Jöhetünk két cégként egy hajón?",
        a: "A formátum egy cég, egy hajó és egy legénység elvére épül. Egyéni kivételek csak a szervező megerősítésével lehetségesek.",
      },
    ],
  },
  contact: {
    eyebrow: "Kapcsolat",
    h2: "Van kérdésed? Keress minket közvetlenül.",
    lead:
      "Szívesen válaszolunk a hajók műszaki specifikációjával és azzal kapcsolatos kérdésekre, hogy a program hogyan illik a csapatodhoz. Általában egy munkanapon belül válaszolunk.",
    orgRole: "fő szervező",
  },
  final: {
    eyebrow: "Következő lépés",
    h2Line1: "Semmire sem kötelez.",
    h2Line2: "Csak képben tart.",
    intro:
      "A jelentkezés még nem nyílt meg — a flottát és a feltételeket véglegesítjük, és nem akarunk helyeket ígérni, amíg nincsenek megerősítve. Hagyd meg az elérhetőségedet, és jelentkezünk, amint a következő lépés kész.",
    note:
      "Nem kötelező. Ez nem regisztráció és nem foglalás. Nem küldünk tömeges hírleveleket — csak információt erről a rendezvényről.",
  },
  form: {
    fullName: "Teljes név *",
    company: "Cég *",
    email: "E-mail *",
    phone: "Telefon",
    people: "Várható létszám",
    licenseLabel: "Van hajóvezetői engedélyed? *",
    licenseYes: "Igen",
    licenseNo: "Nem",
    licenseUnknown: "Nem tudom",
    boatLabel: "Preferált hajó",
    boatUndecided: "Egyelőre nem döntöttem",
    message: "Kérdés vagy megjegyzés",
    consent:
      "Hozzájárulok, hogy az AJservices, s.r.o. felvegye velem a kapcsolatot a Tack & Talk Regatta 2027 rendezvény előkészítésével kapcsolatban.",
    submitIdle: "Többet szeretnék tudni",
    submitSending: "Küldés…",
    success: "Köszönjük. Megkaptuk a megkeresésedet, és jelentkezünk.",
    errorFailed: "A megkeresést nem sikerült elküldeni.",
  },
  footer: {
    claim: "Friss szél a vitorlákban.",
    organizerLabel: "Szervező",
    dateLine: "2027. szeptember 25–30. · Rogoznica, Horvátország",
    mainOrgPre: "Fő szervező: ",
    coOrgLine: "Társszervező: Tangreto, s.r.o.",
    patronageLine: "Michal Hrivnák védnökségével",
    adminLink: "Admin",
  },
  langSwitch: {
    aria: "Nyelv",
  },
  weather: {
    metaTitle: "Vitorlás időjárás az útvonalon – Tack & Talk Regatta 2027",
    metaDescription:
      "Részletes vitorlás időjárás a horvátországi regatta útvonalán: szél, széllökések, irány és hullámok útpontonként, szélrózsa és a szeptember végi jellemző körülmények.",
    navLink: "Időjárás",
    eyebrow: "Vitorlás időjárás",
    h1Line1: "Szél",
    h1Line2: "az útvonalon.",
    lead:
      "Kövesse a szél viselkedését az útvonal egyes pontjain, és készüljön fel a versenyre. Megmutatjuk az előrejelzést, amikor elérhető közelségbe kerül, és a szeptember végi jellemző időjárást az év hátralévő részére.",
    updatedPrefix: "Frissítve",
    sourceNote: "Adatforrás: Open-Meteo",
    disclaimer:
      "Az adatok tájékoztató jellegűek, tervezéshez és felkészüléshez. NEM navigációs alapadat. Hajózás előtt az időjárást a hivatalos tengeri előrejelzésekben kell ellenőrizni.",
    modeForecast: "Előrejelzés",
    modeClimate: "Jellemző időjárás",
    forecastUnavailableTitle: "Az előrejelzés még nincs elérhető közelségben",
    forecastUnavailable:
      "A részletes előrejelzés kb. 14 napra előre terjed. Addig a szeptember végi jellemző időjárást mutatjuk történeti adatokból.",
    loading: "Időjárás betöltése…",
    errorLoading: "Az időjárást nem sikerült betölteni. Kérjük, próbálja meg később.",
    routeTitle: "Pontok az útvonalon",
    now: "Most",
    wind: "Szél",
    gust: "Széllökések",
    direction: "Irány",
    waves: "Hullámok",
    beaufort: "Beaufort",
    knots: "csomó",
    knotsShort: "kn",
    metres: "m",
    safetyLabel: {
      ok: "Megfelelő",
      caution: "Óvatosan",
      danger: "Lemondás kockázata",
    },
    safetyNote:
      "A színek a regatta szabályai szerint: 25 csomó feletti széllökésnél a flottaparancsnok lemondja a szakaszt.",
    compass: {
      N: "É",
      NE: "ÉK",
      E: "K",
      SE: "DK",
      S: "D",
      SW: "DNy",
      W: "Ny",
      NW: "ÉNy",
    },
    windRoseTitle: "Szélrózsa",
    windRoseLead: "Honnan fúj a leggyakrabban szeptember végén.",
    prevailing: "Uralkodó irány",
    climateTitle: "Milyen időjárásra számíthat",
    climateLead:
      "Jellemző körülmények szeptember végén az elmúlt évek alapján.",
    avgWind: "Átlagos szél",
    peakWind: "Erősebb napok",
    avgTemp: "Átlaghőmérséklet",
    maestralFreq: "Maestral gyakorisága",
    overThreshold: "Idő 25 csomó felett",
    timelineTitle: "A szél alakulása",
    timelineLead: "Sebesség és széllökések óránként a következő napokra.",
    sailingWindowTitle: "Hajózási ablak",
    sailingWindowLead: "A hajózási körülmények alkalmassági pontszáma naponta.",
    score: "Pontszám",
    glossaryTitle: "Az Adria szelei",
    glossaryLead: "Három szél, amely meghatározza a hajózást Dalmáciában.",
    winds: [
      {
        name: "Maestral",
        dir: "ÉNy",
        when: "Nyári délutánok",
        desc: "Kellemes termikus tengeri szellő, amely délutánonként erősödik. Általában 10 – 18 csomó, és ideális a hajózáshoz — az a szél, amelyre a regatta a leginkább épül.",
      },
      {
        name: "Bura",
        dir: "ÉK",
        when: "Hirtelen, lökéses",
        desc: "A hegyekből lezúduló hideg, lökéses szél. Hirtelen érkezik, gyakran erős és kiszámíthatatlan, az ég tiszta. Bura idején fokozott óvatosság szükséges.",
      },
      {
        name: "Jugo",
        dir: "DK",
        when: "Fokozatosan épül fel",
        desc: "Meleg, nedves délkeleti szél. Felhőzetet, esőt és fokozatosan növekvő hullámokat hoz. Lassan, de kitartóan erősödik.",
      },
    ],
    teaserEyebrow: "Újdonság",
    teaserTitle: "Vitorlás időjárás az útvonalon",
    teaserLead:
      "Szél, széllökések és hullámok az útvonal pontjain, valamint a szeptember végi jellemző körülmények.",
    teaserCta: "Időjárás megtekintése",
  },
};

export default hu;
