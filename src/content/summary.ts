/*
import { z } from 'astro:content';
import summaryJson from './class/summary.json';

const summarySchema = z.record(z.string(), z.object({
    teachers_email_response_evaluation: z.number(),
    credit_earnability: z.number(),
    class_preparation_workload: z.number(),
    class_difficulty_level: z.number(),
    recommendation_level_of_this_class: z.number(),
    prerequisite_knowledge_for_this_class: z.array(
        z.string(),
    ),
    comment: z.array(
        z.object({
            recommendation_level_of_this_class: z.number(),
            comment: z.string(),
        })
    ),
    are_materials_distributed_in_class: z.object({
        True: z.number(),
        False: z.number(),
    }),
    is_textbook_used_in_class: z.object({
        True: z.number(),
        False: z.number(),
    }),
    class_format: z.object({
        回答人数: z.number(),
        講義: z.number(),
        グループワーク: z.number(),
        発表: z.number(),
        パネルディスカッション: z.number(),
        対話: z.number(),
        オンデマンド: z.number(),
        レポート提出のみ: z.number(),
    }),
}));

export const summaryData = summarySchema.parse(summaryJson);
*/