import { subjectMap } from "./subjectsData2025spring";
import { calcScoreAverage } from "./subjectsDataTypes";

export const getTopNSubject = (n: number) => {
  return [...subjectMap.entries()]
    .map<[string, number]>(([name, subj]) => [
      name,
      calcScoreAverage(subj.subject.recommendation_level_of_this_class) ?? 0,
    ])
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .slice(0, n);
};
