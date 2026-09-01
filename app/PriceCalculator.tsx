"use client";

import { useState } from "react";

// Prepočet ceny na osobu. Jednotkou predaja zostáva loď — cena na hlavu je
// doplnkové číslo. Renderuje sa iba keď sú ceny verejné (rieši Landing).
export default function PriceCalculator({
  boats,
  labels,
  locale,
}: {
  boats: { name: string; price: number }[];
  labels: {
    perPersonLabel: string;
    sliderLabel: string;
    peopleUnit: string;
    perPersonNote: string;
  };
  locale: string;
}) {
  const [people, setPeople] = useState(6);
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="price-calc">
      <div className="price-calc-slider">
        <label htmlFor="crew-size">
          {labels.sliderLabel}: <strong>{people} {labels.peopleUnit}</strong>
        </label>
        <input
          id="crew-size"
          type="range"
          min={4}
          max={10}
          step={1}
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
        />
      </div>
      <div className="price-calc-boats">
        {boats.map((b) => (
          <div key={b.name} className="price-calc-boat">
            <span className="price-calc-boat-name">{b.name}</span>
            <span className="price-calc-total">{fmt(b.price)}</span>
            <span className="price-calc-per">
              {fmt(Math.round(b.price / people))} · {labels.perPersonLabel}
            </span>
          </div>
        ))}
      </div>
      <p className="price-calc-note">{labels.perPersonNote}</p>
    </div>
  );
}
