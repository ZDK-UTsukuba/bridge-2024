import { z } from 'astro:content';
import summaryJson from './class/summary.json';

const summarySchema = z.record(z.string(),
    z.record(z.string(), z.object({
        comment: z.array(
            z.object({
                recommendation_level_of_this_class: z.number(),
                comment: z.string(),
            })
        ),
        proportion_of_experienced_students: z.number(),
        consideration_for_inexperienced_students: z.number(),
        credit_earnability: z.number(),
        exercise_intensity: z.number(),
        male_to_female_ratio: z.number(),
        reccomendation_level_of_this_class: z.number(),
        required_purchases: z.object({
            True: z.number(),
            False: z.number(),
            detail: z.array(
                z.string(),
            ),
        }),
    })
    )
);

export const summaryData = summarySchema.parse(summaryJson);

