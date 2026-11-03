import { z } from "astro:content";
import summaryJson from "./class/summary2025spring.json";
import {
  basicCommentSchema,
  modernGeneralSurveyShape,
  sportSurveyShape,
} from "./summarySchemaParts";

const sportSubjectSchema = z
  .object({
    name: z.string(),
    num: z.number(),
    subject_code: z.array(z.string()),
    subject_term: z.string(),
    college_year: z.null(),
    ...sportSurveyShape,
  })
  .strict();

const generalSubjectSchema = z
  .object({
    name: z.string(),
    num: z.number(),
    subject_code: z.array(z.string()),
    subject_term: z.string(),
    subject_affiliation: z.string(),
    subject_category: z.string(),
    comment: z.array(basicCommentSchema),
    ...modernGeneralSurveyShape,
  })
  .strict();

const summarySchema = z
  .object({
    体育: z.record(
      z.string(),
      z.record(z.string(), z.record(z.string(), sportSubjectSchema)),
    ),
    一般: z.record(
      z.string(),
      z.record(z.string(), z.record(z.string(), generalSubjectSchema)),
    ),
  })
  .strict();

const summaryData = summarySchema.parse(summaryJson);

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
