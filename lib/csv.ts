// Malý CSV pomocník pre exporty leadov z admina.
// RFC 4180 escaping (úvodzovky zdvojené, každá bunka v úvodzovkách) + UTF-8 BOM,
// aby Excel na Windows správne zobrazil diakritiku.

// Byte order mark (U+FEFF) — bez neho Excel na Windows zobrazí diakritiku zle.
const BOM = String.fromCharCode(0xfeff);

export function csvCell(value: unknown): string {
  const text = String(value ?? "").replaceAll('"', '""');
  return `"${text}"`;
}

export function buildCsv(header: string[], rows: unknown[][]): string {
  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
  return `${BOM}${csv}`;
}

export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${filename}`,
      "Cache-Control": "no-store",
    },
  });
}
