export function normalizeSearch(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/gu, "");
}

export function createSearchEntry(id: string, title: string, fields: string[]) {
  return {
    id,
    title: normalizeSearch(title),
    fields: [title, ...fields].map(normalizeSearch),
  };
}

export function searchEntries(
  entries: ReturnType<typeof createSearchEntry>[],
  query: string,
) {
  const terms = query
    .normalize("NFKC")
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map(normalizeSearch);
  const phrase = normalizeSearch(query);
  return entries
    .filter((entry) =>
      terms.every((term) => entry.fields.some((field) => field.includes(term))),
    )
    .map((entry, order) => ({
      id: entry.id,
      order,
      rank: !phrase
        ? 0
        : entry.title === phrase
          ? 3
          : entry.title.startsWith(phrase)
            ? 2
            : entry.title.includes(phrase)
              ? 1
              : 0,
    }))
    .sort((a, b) => b.rank - a.rank || a.order - b.order)
    .map((entry) => entry.id);
}
