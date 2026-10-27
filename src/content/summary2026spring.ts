import { z } from "astro:content";
import summaryJson from "./class/summary2026spring.json";
import {
  basicCommentSchema,
  modernGeneralSurveyShape,
  scoreSummarySchema,
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
    credit_fairness: scoreSummarySchema,
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

export const summaryData = summarySchema.parse(summaryJson);
