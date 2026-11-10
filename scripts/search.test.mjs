import assert from "node:assert/strict";
import { test } from "node:test";
import { createSearchEntry, searchEntries } from "../src/lib/search.ts";

const entries = [
  createSearchEntry("partial", "応用線形代数", [
    "田中 太郎",
    "AB123",
    "情報学群",
  ]),
  createSearchEntry("prefix", "線形代数II", ["鈴木", "CD456"]),
  createSearchEntry("exact", "線形代数", ["田中 太郎", "EF789"]),
  createSearchEntry("english", "Data Science I", ["GH000"]),
];

test("exact title, prefix, and substring matches rank in that order", () => {
  assert.deepEqual(searchEntries(entries, "線形代数"), [
    "exact",
    "prefix",
    "partial",
  ]);
});
test("normalizes full-width characters, case, and title spacing", () => {
  assert.deepEqual(searchEntries(entries, "ｄａｔａ　ＳＣＩＥＮＣＥ"), [
    "english",
  ]);
  assert.deepEqual(searchEntries(entries, "線形代数Ⅱ"), ["prefix"]);
  assert.deepEqual(searchEntries(entries, "ａｂ１２３"), ["partial"]);
});
test("all keywords must match, including across title and teacher fields", () => {
  assert.deepEqual(searchEntries(entries, "線形 田中"), ["partial", "exact"]);
  assert.deepEqual(searchEntries(entries, "線形 存在しない教員"), []);
  assert.deepEqual(searchEntries(entries, "情報学群"), ["partial"]);
});
test("empty queries restore all subjects and unknown queries return none", () => {
  assert.deepEqual(
    searchEntries(entries, "　 "),
    entries.map(({ id }) => id),
  );
  assert.deepEqual(searchEntries(entries, "<script>"), []);
});
