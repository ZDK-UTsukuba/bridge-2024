import { z } from "astro:content";
import summaryJson from "./class/summary2025.json";

const summarySchema = z.object({
  体育: z.record(
    z.string(),
    z.record(
      z.string(),
      z.record(
        z.string(),
        z.object({
          name: z.string(),
          num: z.number(),
          subject_code: z.array(z.string()),
          subject_term: z.string().nullable(),
          college_year: z.string(),
          comment: z.array(
            z.object({
              recommendation_level_of_this_class: z.number(),
              comment: z.string(),
            }),
          ),
          proportion_of_experienced_students: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          consideration_for_inexperienced_students: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          credit_earnability: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          exercise_intensity: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          male_to_female_ratio: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          recommendation_level_of_this_class: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          required_purchases: z.object({
            True: z.number(),
            False: z.number(),
            detail: z.array(z.string()),
          }),
          rain: z.object({
            True: z.number(),
            False: z.number(),
            detail: z.array(z.string()),
          }),
          final: z.object({
            True: z.number(),
            False: z.number(),
            detail: z.array(z.string()),
          }),
          weekly_assignments: z.object({
            True: z.number(),
            False: z.number(),
            detail: z.array(z.string()),
          }),
          overtime_assignments: z.object({
            True: z.number(),
            False: z.number(),
            detail: z.array(z.string()),
          }),
          activity: z.array(z.string()),
        }),
      ),
    ),
  ),
  一般: z.record(
    z.string(),
    z.record(
      z.string(),
      z.record(
        z.string(),
        z.object({
          name: z.string(),
          num: z.number(),
          subject_code: z.array(z.string()),
          subject_term: z.string().nullable(),
          subject_affiliation: z.string(),
          subject_category: z.string(),
          comment: z.array(
            z.object({
              recommendation_level_of_this_class: z.number(),
              comment: z.string(),
            }),
          ),
          credit_earnability: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          class_preparation_workload: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          class_difficulty_level: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          recommendation_level_of_this_class: z.object({
            sum: z.number(),
            count: z.number(),
          }),
          are_materials_distributed_in_class: z.object({
            True: z.number(),
            False: z.number(),
          }),
          is_textbook_used_in_class: z.object({
            True: z.number(),
            False: z.number(),
          }),
          prerequisite_knowledge_for_this_class: z.array(z.string()),
          class_format: z.object({
            講義: z.number(),
            グループワーク: z.number(),
            発表: z.number(),
            other: z.array(z.string()),
          }),
          mode_class_format: z.object({
            講義: z.number(),
            グループワーク: z.number(),
            発表: z.number(),
            other: z.array(z.string()),
          }),
        }),
      ),
    ),
  ),
});

export const summaryData2025 = summarySchema.parse(summaryJson);
