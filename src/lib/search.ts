export function normalizeSearch(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/gu, "");
}

export function createSearchEntry(
  id: string,
  title: string,
  fields: string[],
  affiliations: string[] = [],
  reviewCount = 0,
) {
  const primary = fields.map(normalizeSearch);
  return {
    id,
    reviewCount,
    title: normalizeSearch(title),
    primary,
    fields: [
      normalizeSearch(title),
      ...primary,
      ...affiliations.map(normalizeSearch),
    ],
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
      reviewCount: entry.reviewCount,
      order,
      // Title relevance comes first; metadata only breaks comment-count ties.
      titleMatches: terms.filter((term) => entry.title.includes(term)).length,
      primaryMatches: terms.filter((term) =>
        entry.primary.some((field) => field.includes(term)),
      ).length,
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
    .sort(
      (a, b) =>
        b.rank - a.rank ||
        b.titleMatches - a.titleMatches ||
        b.reviewCount - a.reviewCount ||
        b.primaryMatches - a.primaryMatches ||
        a.order - b.order,
    )
    .map((entry) => entry.id);
}
