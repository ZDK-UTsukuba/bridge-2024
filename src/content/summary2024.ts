import { z } from "astro:content";
import summaryJson from "./class/summary2024.json";
import {
  basicCommentSchema,
  booleanSummarySchema,
  scoreSummarySchema,
  sportSurveyShape,
} from "./summarySchemaParts";

const legacyClassFormatSchema = z
  .object({
    回答人数: z.number(),
    講義: z.number(),
    グループワーク: z.number(),
    発表: z.number(),
    パネルディスカッション: z.number(),
    対話: z.number(),
    オンデマンド: z.number(),
    レポート提出のみ: z.number(),
  })
  .strict();

const generalCommentSchema = basicCommentSchema
  .extend({
    subject_number: z.string(),
  })
  .strict();

const sportSubjectSchema = z
  .object({
    name: z.string(),
    ...sportSurveyShape,
  })
  .strict();

const generalSubjectSchema = z
  .object({
    name: z.string(),
    comment: z.array(generalCommentSchema),
    teachers_email_response_evaluation: scoreSummarySchema,
    credit_earnability: scoreSummarySchema,
    class_preparation_workload: scoreSummarySchema,
    class_difficulty_level: scoreSummarySchema,
    recommendation_level_of_this_class: scoreSummarySchema,
    are_materials_distributed_in_class: booleanSummarySchema,
    is_textbook_used_in_class: booleanSummarySchema,
    prerequisite_knowledge_for_this_class: z.array(z.string()),
    class_format: legacyClassFormatSchema,
  })
  .strict();

const specializedSubjectSchema = z
  .object({
    teachers_email_response_evaluation: z.number().nullable(),
    credit_earnability: z.number(),
    class_preparation_workload: z.number(),
    class_difficulty_level: z.number(),
    recommendation_level_of_this_class: z.number(),
    prerequisite_knowledge_for_this_class: z.array(z.string()),
    comment: z.array(basicCommentSchema),
    are_materials_distributed_in_class: booleanSummarySchema,
    is_textbook_used_in_class: booleanSummarySchema,
    class_format: legacyClassFormatSchema,
    course_college: z.array(z.string()),
  })
  .strict();

const summarySchema = z
  .object({
    体育: z.record(z.string(), z.record(z.string(), sportSubjectSchema)),
    一般: z.record(z.string(), z.record(z.string(), generalSubjectSchema)),
    "専門・専門基礎": z.record(z.string(), specializedSubjectSchema),
  })
  .strict();

export const summaryData = summarySchema.parse(summaryJson);
