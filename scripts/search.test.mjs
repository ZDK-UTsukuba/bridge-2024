import assert from "node:assert/strict";
import { test } from "node:test";
import { createSearchEntry, searchEntries } from "../src/lib/search.ts";

const entries = [
  createSearchEntry(
    "partial",
    "応用線形代数",
    ["田中 太郎", "AB123"],
    ["情報学群"],
  ),
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

test("affiliations remain searchable but rank below titles, teachers, and codes", () => {
  const records = [
    createSearchEntry("college", "数学", [], ["情報学群"]),
    createSearchEntry("teacher", "数学", ["情報 太郎"]),
    createSearchEntry("title", "情報科学", []),
  ];
  assert.deepEqual(searchEntries(records, "情報"), [
    "title",
    "teacher",
    "college",
  ]);
  assert.deepEqual(searchEntries(records, "情報学群"), ["college"]);
  assert.deepEqual(searchEntries(records, "数学 情報"), ["teacher", "college"]);
  const codes = [
    createSearchEntry("affiliation", "演習", [], ["AB研究群"]),
    createSearchEntry("code", "講義", ["AB123"]),
  ];
  assert.deepEqual(searchEntries(codes, "AB"), ["code", "affiliation"]);
});

test("multi-term title matches outrank matches split across title and affiliation", () => {
  const records = [
    createSearchEntry("mixed", "数学", [], ["情報学群"]),
    createSearchEntry("title", "情報の数学", []),
  ];
  assert.deepEqual(searchEntries(records, "情報 数学"), ["title", "mixed"]);
  assert.deepEqual(searchEntries(records, "数学 情報"), ["title", "mixed"]);
});

test("comment count breaks equal match ties without overriding match priority", () => {
  const records = [
    createSearchEntry("few", "情報科学A", [], [], 1),
    createSearchEntry("many", "情報科学B", [], [], 10),
    createSearchEntry("same", "情報科学C", [], [], 10),
    createSearchEntry("affiliation", "数学", [], ["情報学群"], 100),
    createSearchEntry("exact", "情報", [], [], 0),
  ];
  assert.deepEqual(searchEntries(records, "情報"), [
    "exact",
    "many",
    "same",
    "few",
    "affiliation",
  ]);
  assert.deepEqual(searchEntries(records, ""), [
    "affiliation",
    "many",
    "same",
    "few",
    "exact",
  ]);
});
