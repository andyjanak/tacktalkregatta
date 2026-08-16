"use client";

import { useState } from "react";

export default function PasswordInput({
  name,
  label,
  autoComplete,
}: {
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="password-field">
      <span>{label}</span>
      <div>
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={12}
          maxLength={128}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-pressed={visible}
        >
          {visible ? "Skryť" : "Zobraziť"}
        </button>
      </div>
    </label>
  );
}
