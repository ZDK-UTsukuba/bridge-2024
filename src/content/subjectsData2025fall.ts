import { z } from "astro:content";
import summaryJson from "./class/summary2025fall.json";
import {
  basicCommentSchema,
  modernGeneralSurveyShape,
  sportSurveyShape,
} from "./summarySchemaParts";

const generalCommentSchema = basicCommentSchema
  .extend({
    subject_code: z.string(),
  })
  .strict();

const sportSubjectSchema = z
  .object({
    name: z.string(),
    num: z.number(),
    subject_code: z.array(z.string()),
    subject_term: z.string(),
    college_year: z.string(),
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
    comment: z.array(generalCommentSchema),
    ...modernGeneralSurveyShape,
  })
  .strict();

const subjectSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("一般"),
      subject_category: z.string(),
      affiliation: z.string(),
      name: z.string(),
      subject: generalSubjectSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal("体育"),
      term: z.string(),
      subject_category: z.string(),
      name: z.string(),
      subject: sportSubjectSchema,
    })
    .strict(),
]);

type subj = z.infer<typeof subjectSchema>;

const subjects = z.array(subjectSchema).parse(summaryJson);

export const subjectMap = new Map<string, subj>(
  subjects.map<[string, subj]>((subject) => [
    subject.type === "一般"
      ? subject.name
      : `${subject.term}-${subject.subject_category}-${subject.name}`,
    subject,
  ]),
);
