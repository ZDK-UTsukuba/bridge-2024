import { summaryData } from "./summary2025";

type valueof<T> = T[keyof T];

type subj =
  | {
      type: "一般";
      subject_category: string;
      affiliation: string;
      name: string;
      subject: valueof<valueof<valueof<(typeof summaryData)["一般"]>>>;
    }
  | {
      type: "体育";
      term: string;
      subject_category: string;
      name: string;
      subject: valueof<valueof<valueof<(typeof summaryData)["体育"]>>>;
    };

export const subjectMap = new Map<string, subj>([
  ...[...Object.entries(summaryData["一般"])].flatMap(
    ([subject_category, subjects]) =>
      [...Object.entries(subjects)].flatMap(([affiliation, subjects]) =>
        [...Object.entries(subjects)].map<[string, subj]>(
          ([subject_name, subject]) => [
            subject_name,
            {
              type: "一般",
              subject_category,
              affiliation,
              name: subject_name,
              subject,
            },
          ],
        ),
      ),
  ),
  ...[...Object.entries(summaryData["体育"])].flatMap(([term, subjects]) =>
    [...Object.entries(subjects)].flatMap(([subject_category, subjects]) =>
      [...Object.entries(subjects)].map<[string, subj]>(
        ([subject_name, subject]) => [
          `${term}-${subject_category}-${subject_name}`,
          {
            type: "体育",
            term: term,
            subject_category,
            name: subject_name,
            subject,
          },
        ],
      ),
    ),
  ),
]);
