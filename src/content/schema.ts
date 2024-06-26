import { z } from 'astro:content';
import bridgeData from './class/bridge-2023.json';

const BridgeSchema = z.object({
    "surveies": z.array(
        z.object({
            "start_datetime": z.string(),
            "end_datetime": z.string(),
            "course_class": z.enum([ '体育', '専門導入科目', '学士基盤科目', '科目区分を選択してください。' ]),
            "course": z.union([
                z.object({
                    "collages": z.string(),
                    "class_name": z.string(),
                    "proportion_of_experienced_students": z.number(),
                    "consideration_for_inexperienced_students": z.number(),
                    "credit_earnability": z.number(),
                    "exercise_intensity": z.number(),
                    "male_to_female_ratio": z.number(),
                    "reccomendation_level_of_this_class": z.number(),
                    "required_purchases": z.object({
                        "required": z.boolean(),
                        "detail": z.optional(z.string()),
                    }),
                    "comment": z.string(),
                }),
                z.object({
                    "course_name": z.string(),
                    "teachers_email_response_evaluation": z.number(),
                    "credit_earnability": z.number(),
                    "class_preparation_workload": z.number(),
                    "class_difficulty_level": z.number(),
                    "are_materials_distributed_in_class": z.boolean(),
                    "is_textbook_used_in_class": z.boolean(),
                    "class_format": z.array(z.string()), // z.enum(['講義', 'オンデマンド', 'グループワーク', '発表', '対話', 'パネルディスカッション', 'レポート提出のみ']),
                    "recommendation_level_of_this_class": z.number(),
                    "prerequisite_knowledge_for_this_class": z.string(),
                    "comment": z.string(),
                }),
                z.object(({ }))
            ]),
        }),
    ),
});

export const sampleData = BridgeSchema.parse(bridgeData);
