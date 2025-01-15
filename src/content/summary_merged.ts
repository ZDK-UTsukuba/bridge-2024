import { z } from 'astro:content';
import summaryJson from './class/summary_merged.json';

const summarySchema = z.object({
    "体育": z.record(z.string(),
        z.record(z.string(),
            z.object({
                name: z.string(),
                comment: z.array(
                    z.object({
                        recommendation_level_of_this_class: z.number(),
                        comment: z.string(),
                    })
                ),
                proportion_of_experienced_students: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                consideration_for_inexperienced_students: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                credit_earnability: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                exercise_intensity: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                male_to_female_ratio: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                recommendation_level_of_this_class: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                required_purchases: z.object({
                    True: z.number(),
                    False: z.number(),
                    detail: z.array(
                        z.string(),
                    ),
                }),
                rain: z.object({
                    True: z.number(),
                    False: z.number(),
                    detail: z.array(
                        z.string(),
                    ),
                }),
                final: z.object({
                    True: z.number(),
                    False: z.number(),
                    detail: z.array(
                        z.string(),
                    ),
                }),
                weekly_assignments: z.object({
                    True: z.number(),
                    False: z.number(),
                    detail: z.array(
                        z.string(),
                    ),
                }),
                overtime_assignments: z.object({
                    True: z.number(),
                    False: z.number(),
                    detail: z.array(
                        z.string(),
                    ),
                }),
                activity: z.array(
                    z.string(),
                ),
            })
        )
    ),
    "一般": z.record(z.string(),
        z.record(z.string(),
            z.object({
                comment: z.array(
                    z.object({
                        recommendation_level_of_this_class: z.number(),
                        comment: z.string(),
                    })
                ),
                teachers_email_response_evaluation: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                credit_earnability: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                class_preparation_workload: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                class_difficulty_level: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                recommendation_level_of_this_class: z.object({
                    "sum": z.number(),
                    "count": z.number(),
                }),
                are_materials_distributed_in_class: z.object({
                    True: z.number(),
                    False: z.number(),
                }),
                is_textbook_used_in_class: z.object({
                    True: z.number(),
                    False: z.number(),
                }),
                prerequisite_knowledge_for_this_class: z.array(
                    z.string(),
                ),
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
            })
        )
    ),
    "専門・専門基礎": z.record(z.string(), z.object({
        teachers_email_response_evaluation: z.nullable(z.number()),
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
    }))
});


export const summaryData = summarySchema.parse(summaryJson);

