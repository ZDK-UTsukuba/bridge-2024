import { subjectMap } from "./subjectsData2024";

const calcAve = (numOrObj: number | { sum: number; count: number }) => {
  if (typeof numOrObj === "number") {
    return numOrObj;
  }
  return Number.isNaN(numOrObj.sum / numOrObj.count)
    ? 0
    : numOrObj.sum / numOrObj.count;
};

export const getTopNSubject = (n: number) => {
  return [...subjectMap.entries()]
    .map<[string, number]>(([name, subj]) => [
      name,
      calcAve(subj.subject.recommendation_level_of_this_class),
    ])
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .slice(0, n);
};
