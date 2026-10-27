import { z } from "astro:content";

export const scoreSummarySchema = z
  .object({
    sum: z.number(),
    count: z.number(),
  })
  .strict();

export const basicCommentSchema = z
  .object({
    recommendation_level_of_this_class: z.number(),
    comment: z.string(),
  })
  .strict();

export const booleanSummarySchema = z
  .object({
    True: z.number(),
    False: z.number(),
  })
  .strict();

export const booleanSummaryWithDetailSchema = booleanSummarySchema
  .extend({
    detail: z.array(z.string()),
  })
  .strict();

export const modernClassFormatSchema = z
  .object({
    講義: z.number(),
    グループワーク: z.number(),
    発表: z.number(),
    other: z.array(z.string()),
  })
  .strict();

export const sportSurveyShape = {
  comment: z.array(basicCommentSchema),
  proportion_of_experienced_students: scoreSummarySchema,
  consideration_for_inexperienced_students: scoreSummarySchema,
  credit_earnability: scoreSummarySchema,
  exercise_intensity: scoreSummarySchema,
  male_to_female_ratio: scoreSummarySchema,
  recommendation_level_of_this_class: scoreSummarySchema,
  required_purchases: booleanSummaryWithDetailSchema,
  rain: booleanSummaryWithDetailSchema,
  final: booleanSummaryWithDetailSchema,
  weekly_assignments: booleanSummaryWithDetailSchema,
  overtime_assignments: booleanSummaryWithDetailSchema,
  activity: z.array(z.string()),
};

export const modernGeneralSurveyShape = {
  credit_earnability: scoreSummarySchema,
  class_preparation_workload: scoreSummarySchema,
  class_difficulty_level: scoreSummarySchema,
  recommendation_level_of_this_class: scoreSummarySchema,
  are_materials_distributed_in_class: booleanSummarySchema,
  is_textbook_used_in_class: booleanSummarySchema,
  prerequisite_knowledge_for_this_class: z.array(z.string()),
  class_format: modernClassFormatSchema,
  mode_class_format: modernClassFormatSchema,
};
