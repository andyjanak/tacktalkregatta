import type { Dict } from "./sk";

// English dictionary. Same keys as sk.ts (enforced by the Dict type).
const en: Dict = {
  htmlLang: "en",
  meta: {
    title: "Tack & Talk Regatta 2027 – Central European corporate sailing regatta in Croatia",
    description:
      "A Central European corporate regatta in Croatia for 20 crews – four race days on the water and a business programme ashore. Tack & Talk Regatta 2027, Rogoznica, 25–30 September 2027.",
    keywords: [
      "corporate regatta",
      "business regatta",
      "corporate sailing team building",
      "corporate sailing trip",
      "regatta Croatia",
      "corporate event",
      "sailing for companies",
      "team building Croatia",
    ],
    ogLocale: "en_US",
    ogImageAlt: "Tack & Talk Regatta 2027 — Fresh wind in the sails",
    eventDescription:
      "A corporate regatta with four race days and nine races. Five nights in Croatian Dalmatia for 20 company crews.",
  },
  nav: {
    koncept: "Concept",
    preKoho: "Who it’s for",
    trasa: "Route & programme",
    pocasie: "Weather",
    faq: "FAQ",
    kontakt: "Contact",
    mainAria: "Main navigation",
    menu: "Menu",
    mobileAria: "Mobile navigation",
    brandUpAria: "Tack & Talk - top",
  },
  hero: {
    eyebrow: "Central European corporate regatta · Dalmatia 2027",
    h1Line1: "Fresh wind",
    h1Line2Pre: "in the ",
    h1Em: "sails.",
    lead:
      "Five nights. Four days on the water. Twenty company crews and content that keeps going after you return to the marina.",
    scoring:
      "Half the points are earned on the water, half in the programme ashore.",
    patronage: "Under the patronage of Michal Hrivnák",
    ctaConcept: "See the concept",
    ctaRoute: "Route & programme",
    cardKicker: "Rogoznica · Croatia",
    cardDate: "25–30 Sept",
    statBoats: "boats",
    statPeople: "people",
    statRaces: "races",
    note: "Concept and fleet in preparation",
    videoTitle: "Yachting at sea",
    visualAria: "Key regatta facts",
  },
  statusStrip: {
    line1: "Project in preparation",
    line2: "Public registration will open only after contractual and legal confirmation.",
  },
  koncept: {
    eyebrow: "Not team building. A shared challenge.",
    h2: "At sea a company shows its true colours.",
    lead:
      "A small space, changing conditions and a clear goal. The regatta combines sporting discipline with content that continues after you return.",
    card1Label: "On the water",
    card1H3: "One fleet, fair play.",
    card1P:
      "Nine races, two boat classes and one shared start line. A cautious decision is never penalised.",
    card1Points: "Carries half of the total points.",
    card1Ratio: "races",
    card2Label: "Ashore",
    card2H3: "Real problems, not business cards.",
    card2P:
      "Evening discussions, a workshop and guided networking. The programme is built around problems companies actually face.",
    card2Points: "Carries the other half of the points — as important as the sailing.",
    card2Ratio: "content blocks",
    splitEyebrow: "Equal weight",
    splitTitle: "50 / 50",
    splitP:
      "The overall ranking comes in equal parts from the water and from shore. A team doesn’t win just because it happens to have two experienced sailors — and nobody loses motivation mid-week, because they’re playing for half the points off the boat too.",
    ruleLabel: "Participation rule",
    ruleTitle: "One company. One boat. One crew.",
    ruleP:
      "One boat holds one team from one company. No mixed crews, no boats assembled from several companies. You compete as a company — and work together off the water too.",
    whoKicker: "Who organises it",
    whoPre: "The event is prepared by ",
    whoLink: "AJservices, s.r.o.",
    whoPost:
      " as the main organiser, together with co-organiser Tangreto, s.r.o. and under the patronage of fleet commander Michal Hrivnák.",
  },
  audience: {
    eyebrow: "Who it’s for",
    h2: "For teams that decide together.",
    lead:
      "Tack & Talk is not a company outing. It’s five nights during which a company team works, sails and decides together in a space the size of a living room. Nobody slips away to a call. Nobody disappears after the second course.",
    cards: [
      {
        h3: "Company leadership and management teams",
        p: "For people who make decisions together but rarely get four days to think them through to the end.",
      },
      {
        h3: "Sales and project teams",
        p: "Where the result depends on how well the team plays together, and where it pays to see how it behaves under pressure outside the office.",
      },
      {
        h3: "Companies hosting clients and partners",
        p: "One boat is a space for conversations and a shared experience that continues after you return.",
      },
    ],
    summaryPre: "One company forms ",
    summaryStrong: "one crew on one boat",
    summaryPost:
      ". A recommended team has four to ten people depending on the chosen boat.",
    noNeedAria: "What you don’t need to take part",
    noNeed: [
      {
        title: "Sailing experience",
        desc: "A company can bring its own skipper or request a recommendation.",
      },
      {
        title: "Athletic fitness",
        desc: "Sailing takes up part of the day; the rest belongs to the programme and the anchorage.",
      },
      {
        title: "To own a boat",
        desc: "The company arranges the boat itself, according to the confirmed specification.",
      },
    ],
  },
  route: {
    eyebrow: "Route · 5 nights · 4 race days · 9 races",
    h2Line1: "Five points.",
    h2Line2: "Four days.",
    lead:
      "Rogoznica, Tribunj, Jezera, Zlarin and back to Marina Frapa. Pick a point on the map to see the day’s programme.",
    mapAria: "Schematic interactive route map",
    mapInstruction: "Pick point 1 – 5",
    mapTitle: "Route of TACK & TALK REGATTA 2027",
    mapDesc:
      "A schematic route from Rogoznica via Tribunj, Jezera and Zlarin back to Rogoznica. Five interactive points open the daily plan.",
    disclaimer:
      "The schematic map is only for presenting the programme. It is not a navigation source. Before sailing, verify the route in official nautical charts and pilot books.",
    baseEyebrow: "Base",
    baseName: "Marina Frapa",
    baseP: "Rogoznica, Croatia. Twenty boats and roughly 120 participants.",
    ol: [
      { strong: "Rogoznica", span: "boat handover" },
      { strong: "Tribunj", span: "race day 1" },
      { strong: "Jezera", span: "race day 2" },
      { strong: "Zlarin", span: "race day 3" },
      { strong: "Rogoznica", span: "final & awards" },
    ],
    safetyStrong: "Caution is never penalised.",
    safetySpan:
      "The fleet commander may cancel a leg or change the route. Night sailing is prohibited.",
  },
  program: {
    eyebrow: "Daily plan",
    h2: "Four days. Nine races.",
    lead:
      "The exact daily schedule R1–R9 will be published in the sailing instructions. Here we show only the confirmed route and the programme framework.",
    tabsAria: "Pick a programme day",
    arrivalTag: "Arrival",
    regataTag: "Regatta",
    factsAria: "Facts of the day",
    raceStatusLabel: "races over four race days",
    raceStatusP:
      "The number of races on each day and their courses will be confirmed in the sailing instructions. A safety decision by the fleet commander always takes priority.",
    shoreLabel: "Programme ashore",
  },
  days: {
    arrival: {
      tab: "Arrival",
      destination: "Rogoznica",
      title: "Rogoznica",
      route: "Marina Frapa · fleet arrival",
      programme:
        "Boat handover and inspection with the organiser’s help, skippers’ briefing and the event opening.",
      facts: ["Boat handover", "Organiser inspection", "Dinner 1/5"],
      eveningTitle: "Opening evening",
      eveningCopy:
        "The first shared dinner and a gathering of the crews before the racing part begins.",
      mapSub: "Night 1 · arrival",
    },
    day1: {
      tab: "Day 1",
      destination: "Tribunj",
      title: "Rogoznica → Tribunj",
      route: "First race day",
      programme:
        "Breakfast, morning briefing and the first part of the regatta finishing in Tribunj. The exact race schedule will be published in the sailing instructions.",
      facts: ["Race day 1/4", "Breakfast 1/4", "Dinner 2/5"],
      eveningTitle: "Tribunj",
      eveningCopy:
        "A shared dinner and space for conversations between crews after the first race day.",
      mapSub: "Day 1",
    },
    day2: {
      tab: "Day 2",
      destination: "Jezera",
      title: "Tribunj → Jezera",
      route: "Second race day",
      programme:
        "Breakfast, morning briefing and the racing programme on the route to Jezera. The exact race schedule will be published in the sailing instructions.",
      facts: ["Race day 2/4", "Breakfast 2/4", "Dinner 3/5"],
      eveningTitle: "Jezera",
      eveningCopy:
        "A shared dinner and meetings across the fleet, including the programme aboard BALI 5.2.",
      mapSub: "Day 2",
    },
    day3: {
      tab: "Day 3",
      destination: "Zlarin",
      title: "Jezera → Zlarin",
      route: "Third race day",
      programme:
        "Breakfast, morning briefing and the racing programme finishing at Zlarin. The exact race schedule will be published in the sailing instructions.",
      facts: ["Race day 3/4", "Breakfast 3/4", "Dinner 4/5"],
      eveningTitle: "Zlarin",
      eveningCopy:
        "The whole fleet gathers for a shared dinner and programme after the third race day.",
      mapSub: "Day 3",
    },
    day4: {
      tab: "Day 4",
      destination: "Rogoznica",
      title: "Zlarin → Rogoznica",
      route: "Final race day",
      programme:
        "Breakfast, morning briefing and the final part of the regatta with a return to Marina Frapa in Rogoznica.",
      facts: ["Race day 4/4", "Breakfast 4/4", "Dinner 5/5"],
      eveningTitle: "Final in Rogoznica",
      eveningCopy: "The closing shared dinner and the announcement of the regatta results.",
      mapSub: "Day 4 · final",
    },
  },
  safety: {
    eyebrow: "Rule number one",
    h2: "Safety takes priority over competition.",
    lead:
      "Caution is never penalised. A safety retirement means the average of your legs so far, not a defeat.",
    rules: [
      { id: "5.1", rule: "No night sailing" },
      {
        id: "5.2",
        rule:
          "Wind above 25 knots — the fleet commander cancels the leg, moving in convoy under engine",
      },
      {
        id: "5.3",
        rule:
          "Life jackets mandatory at night, above 20 knots, in a MOB, and for non-swimmers and children",
      },
      {
        id: "5.4",
        rule:
          "Zero alcohol tolerance for the captain and helmsman while sailing",
      },
    ],
  },
  patronage: {
    badge: "Under the patronage of",
    photoAlt: "Michal Hrivnák at the helm",
    eyebrow: "Experience at the helm",
    name: "Michal Hrivnák",
    p1:
      "The founder of Tangreto came to sailing at the age of six on Slovak lakes and has sailed the open sea since 2003. He has been involved in regattas since 2013 and founded Tangreto in 2014.",
    p2:
      "According to his official profile he has more than 30,000 nautical miles behind him. Tack & Talk Regatta 2027 is being prepared under his patronage.",
    profileLink: "Official profile on Tangreto",
  },
  fees: {
    eyebrow: "Boats & package",
    h2Line1: "Two boats.",
    h2Line2: "A complete package.",
    lead:
      "The package includes the complete boat, deposit insurance, fees, meals, the regatta and the shared BALI 5.2 catamaran. Boat prices will be published on 15 October 2026.",
    card1Label: "Dufour 460",
    card1H3: "A complete boat for a company crew.",
    card1P: "One price per boat and a confirmed scope of event services.",
    card2Label: "Dufour 470",
    card2H3: "More space. The same programme.",
    card2P: "One price per boat and a confirmed scope of event services.",
    priceLabel: "Prices",
    priceStrong: "Boat prices will be published on 15 October 2026.",
    priceP:
      "Until then we’re communicating the concept, the route and the package contents. Leave us your contact below and we’ll be in touch.",
    includesLabel: "The price of each boat includes",
    includesAria: "What each boat’s price includes",
    includes: [
      "the complete boat",
      "deposit insurance and fees",
      "boat handover check and assistance by the organiser",
      "five shared dinners",
      "four breakfasts",
      "the regatta: four race days and nine races",
      "the BALI 5.2 catamaran throughout the event",
    ],
    includesNote: "Exact boat prices will be published on 15 October 2026.",
    baliEyebrow: "Included · with the fleet the whole time",
    baliH3: "Grab a coffee with your rivals aboard BALI 5.2 Lumiere.",
    baliP:
      "The shared catamaran is included in the price of each boat. Throughout the event it creates space for meetings between crews, morning coffee and conversations after returning to port.",
    baliSpecsAria: "BALI 5.2 Lumiere catamaran specifications",
    baliSpecs: {
      year: "Year",
      length: "Length",
      beam: "Beam",
      capacity: "Capacity",
      cabinsWc: "Cabins / WC",
      engines: "Engines",
      lengthVal: "15.9 m",
      beamVal: "8.15 m",
      capacityVal: "12 people",
    },
    baliFeatures:
      "Flybridge · air conditioning · generator · watermaker · coffee machine",
    baliPhotoAlt: "BALI 5.2 catamaran sailing at sea",
    baliCaption: "Promo photo · BALI Catamarans",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    h2: "What to know before setting sail.",
    lead:
      "The answers apply to the event format in preparation. Technical and contractual terms will be added before participation opens.",
    items: [
      {
        q: "Nobody in our crew has ever sailed. Can we still take part?",
        a: "Yes. You can hire a professional skipper for the boat who commands, teaches and is responsible for safe sailing the whole week. Professional skipper capacity is limited, so arrange one well in advance.",
      },
      {
        q: "Who can command the boat?",
        a: "Every boat must have a person with a valid boat licence recognised in Croatia and authorisation to operate the VHF marine radio. The charter company verifies the specific documents before handing over the boat.",
      },
      {
        q: "How does the skipper work?",
        a: "The skipper is a professional captain who takes care of sailing, manoeuvres and safety. They sleep aboard and are part of the crew. The company contracts the skipper directly; the organiser is not a party to that contract.",
      },
      {
        q: "How do we get to Rogoznica?",
        a: "The nearest airport is in Split. Each company arranges its own transport; if there is enough interest, we’ll help coordinate shared transport.",
      },
      {
        q: "Is it safe?",
        a: "Safety takes priority over competition. There is no night sailing; with a forecast above 25 knots the fleet commander cancels the leg and the fleet moves in convoy. Every boat reports on the shared VHF channel. A captain who does not sail for safety reasons loses no points; they receive the average of their results so far.",
      },
      {
        q: "What is the weather like at the end of September?",
        a: "You can typically expect a sea temperature around 22 °C and daytime air of roughly 22 to 26 °C, with cooler evenings. Actual conditions may vary and the sailing plan always adapts to them.",
      },
      {
        q: "How does the racing actually work?",
        a: "The nine races are scored with the low-point system — a lower total is better. But half of the total points are earned off the water, in the programme ashore. Equal weight of sailing and content means the whole team decides, not just the helm.",
      },
      {
        q: "Can we come as two companies on one boat?",
        a: "The format is built as one company, one boat and one crew. Individual exceptions will be possible only with the organiser’s confirmation.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    h2: "Have a question? Reach out directly.",
    lead:
      "We’re happy to answer questions about the technical specification of the boats and how the programme suits your team. We usually reply within one business day.",
    orgRole: "main organiser",
  },
  final: {
    eyebrow: "Next step",
    h2Line1: "It doesn’t commit you.",
    h2Line2: "It just keeps you in the loop.",
    intro:
      "Registration isn’t open yet — we’re finalising the fleet and the terms and don’t want to promise places until they’re confirmed. Leave us your contact and we’ll get in touch when the next step is ready.",
    note:
      "Non-binding. This is not a registration or a reservation. We don’t send mass newsletters — only information about this event.",
  },
  form: {
    fullName: "Full name *",
    company: "Company *",
    email: "E-mail *",
    phone: "Phone",
    people: "Estimated number of people",
    licenseLabel: "Do you have a boat licence? *",
    licenseYes: "Yes",
    licenseNo: "No",
    licenseUnknown: "Not sure",
    boatLabel: "Preferred boat",
    boatUndecided: "Undecided for now",
    message: "Question or note",
    consent:
      "I agree that AJservices, s.r.o. may contact me regarding the preparation of the Tack & Talk Regatta 2027 event.",
    submitIdle: "I want to know more",
    submitSending: "Sending…",
    success: "Thank you. We’ve received your enquiry and will be in touch.",
    errorFailed: "The enquiry could not be sent.",
  },
  footer: {
    claim: "Clear your head. Set your course.",
    organizerLabel: "Organiser",
    dateLine: "25–30 September 2027 · Rogoznica, Croatia",
    mainOrgPre: "Main organiser: ",
    coOrgLine: "Co-organiser: Tangreto, s.r.o.",
    patronageLine: "Under the patronage of Michal Hrivnák",
    adminLink: "Admin",
  },
  langSwitch: {
    aria: "Language",
  },
  weather: {
    metaTitle: "Sailing weather on the route – Tack & Talk Regatta 2027",
    metaDescription:
      "Detailed sailing weather along the regatta route in Croatia: wind, gusts, direction and waves by waypoint, wind rose and typical conditions in late September.",
    navLink: "Weather",
    eyebrow: "Sailing weather",
    h1Line1: "Wind",
    h1Line2: "on the route.",
    lead:
      "Follow how the wind behaves at each point of the route and get ready for the race. We show the forecast when it’s in range, and typical late-September weather for the rest of the year.",
    updatedPrefix: "Updated",
    sourceNote: "Data source: Open-Meteo",
    disclaimer:
      "The data is indicative, intended for planning and preparation. It is NOT a navigation source. Before sailing, verify the weather in official marine forecasts.",
    modeForecast: "Forecast",
    modeClimate: "Typical weather",
    forecastUnavailableTitle: "The forecast isn’t in range yet",
    forecastUnavailable:
      "A detailed forecast reaches about 14 days ahead. Until then we show typical late-September weather from historical data.",
    loading: "Loading weather…",
    errorLoading: "The weather could not be loaded. Please try again later.",
    routeTitle: "Points on the route",
    now: "Now",
    wind: "Wind",
    gust: "Gusts",
    direction: "Direction",
    waves: "Waves",
    beaufort: "Beaufort",
    knots: "knots",
    knotsShort: "kn",
    metres: "m",
    safetyLabel: {
      ok: "Suitable",
      caution: "Caution",
      danger: "Cancellation risk",
    },
    safetyNote:
      "Colours follow the regatta rules: above 25 knots in gusts the fleet commander cancels the leg.",
    compass: {
      N: "N",
      NE: "NE",
      E: "E",
      SE: "SE",
      S: "S",
      SW: "SW",
      W: "W",
      NW: "NW",
    },
    windRoseTitle: "Wind rose",
    windRoseLead: "Where the wind most often blows from in late September.",
    prevailing: "Prevailing direction",
    climateTitle: "What weather to expect",
    climateLead:
      "Typical conditions in late September based on recent years.",
    avgWind: "Average wind",
    peakWind: "Stronger days",
    avgTemp: "Average temperature",
    maestralFreq: "Maestral frequency",
    overThreshold: "Time above 25 knots",
    timelineTitle: "Wind development",
    timelineLead: "Speed and gusts hour by hour for the coming days.",
    sailingWindowTitle: "Sailing window",
    sailingWindowLead: "A suitability score for sailing conditions by day.",
    score: "Score",
    glossaryTitle: "Winds of the Adriatic",
    glossaryLead: "Three winds that shape sailing in Dalmatia.",
    winds: [
      {
        name: "Maestral",
        dir: "NW",
        when: "Summer afternoons",
        desc: "A pleasant thermal sea breeze that builds in the afternoon. Usually 10 – 18 knots and ideal for sailing — the wind the regatta relies on most.",
      },
      {
        name: "Bura",
        dir: "NE",
        when: "Sudden, gusty",
        desc: "A cold gusty wind falling from the mountains. It arrives suddenly, tends to be strong and unpredictable, with a clear sky. In a bura, extra caution is called for.",
      },
      {
        name: "Jugo",
        dir: "SE",
        when: "Builds gradually",
        desc: "A warm, humid south-easterly wind. It brings cloud, rain and gradually rising waves. It builds slowly but steadily.",
      },
    ],
    teaserEyebrow: "New",
    teaserTitle: "Sailing weather on the route",
    teaserLead:
      "Wind, gusts and waves by point of the route plus typical late-September conditions.",
    teaserCta: "See the weather",
  },
  results: {
    metaTitle: "Results and scoring – Tack & Talk Regatta 2027",
    metaDescription:
      "Scoring system, tie-break rules and results of the Tack & Talk regatta. The results archive stays online.",
    navLink: "Results",
    eyebrow: "Results and scoring",
    h1Line1: "Results",
    h1Line2: "of the regatta.",
    lead:
      "Before the first edition you'll find the scoring rules here. After the regatta the page fills with results — and the archive stays online.",
    scoringTitle: "Scoring system",
    scoringLead: "Nine races · low-point system",
    scoringP:
      "Each race awards points by finishing position — the winner gets the fewest points. The overall ranking is the sum of nine races; a lower total is better. But half of the event's total points are earned off the water, in the programme ashore.",
    tieTitle: "In case of a tie",
    tieP:
      "If two crews have the same total, the number of better placings decides; if those tie too, the result of the last shared race. The exact rule is confirmed by the sailing instructions.",
    whenTitle: "When and where the results appear",
    whenP:
      "Interim standings are published after each race day, at the marina and here on the page. The overall results and prize-giving are on the final day in Rogoznica.",
    liveTitle: "Live results",
    liveP: "We'll add the link to live results before the regatta starts.",
    liveSoon: "Coming soon",
    archiveTitle: "Editions",
    editionPrefix: "Edition",
    upcoming: "Coming soon",
  },
};

export default en;
