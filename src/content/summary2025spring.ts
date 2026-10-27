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

export const summaryData = summarySchema.parse(summaryJson);
