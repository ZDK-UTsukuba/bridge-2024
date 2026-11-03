import { z } from "astro:content";
import summaryJson from "./class/summary2023.json";
import {
  basicCommentSchema,
  legacyGeneralSurveyShape,
  sportSurveyShape,
} from "./summarySchemaParts";
import {
  aggregateScore,
  classFormatWithoutOther,
  normalizeSportName,
} from "./subjectsDataTypes";
import type {
  GeneralSubject,
  SportSubject,
  Subject,
  SubjectComment,
} from "./subjectsDataTypes";

const sportSubjectSchema = z
  .object(sportSurveyShape)
  .omit({
    rain: true,
    final: true,
    weekly_assignments: true,
    overtime_assignments: true,
    activity: true,
  })
  .extend({
    name: z.string(),
    num: z.number(),
    subject_code: z.array(z.string()),
    subject_term: z.null(),
    college_year: z.string(),
  })
  .strict();

const generalSubjectSchema = z
  .object({
    name: z.string(),
    num: z.number(),
    subject_code: z.array(z.string()),
    subject_term: z.null(),
    subject_affiliation: z.string(),
    subject_category: z.string(),
    comment: z.array(basicCommentSchema),
    ...legacyGeneralSurveyShape,
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
      term: z.null(),
      subject_category: z.string(),
      name: z.string(),
      subject: sportSubjectSchema,
    })
    .strict(),
]);

type SourceSubject = z.infer<typeof subjectSchema>;

const commentWithoutCode = (comment: {
  recommendation_level_of_this_class: number;
  comment: string;
}): SubjectComment => ({
  subject_code: null,
  recommendation_level_of_this_class:
    comment.recommendation_level_of_this_class,
  comment: comment.comment,
});

const normalizeGeneralSubject = (
  source: Extract<SourceSubject, { type: "一般" }>,
): GeneralSubject => ({
  type: "一般",
  subject_category: source.subject_category,
  affiliation: source.affiliation,
  name: source.name,
  subject: {
    name: source.subject.name,
    num: source.subject.num,
    subject_code: source.subject.subject_code,
    subject_term: source.subject.subject_term,
    subject_affiliation: source.subject.subject_affiliation,
    subject_category: source.subject.subject_category,
    comment: source.subject.comment.map(commentWithoutCode),
    teachers_email_response_evaluation: aggregateScore(
      source.subject.teachers_email_response_evaluation,
    ),
    credit_earnability: aggregateScore(source.subject.credit_earnability),
    credit_fairness: null,
    class_preparation_workload: aggregateScore(
      source.subject.class_preparation_workload,
    ),
    class_difficulty_level: aggregateScore(
      source.subject.class_difficulty_level,
    ),
    recommendation_level_of_this_class: aggregateScore(
      source.subject.recommendation_level_of_this_class,
    ),
    are_materials_distributed_in_class:
      source.subject.are_materials_distributed_in_class,
    is_textbook_used_in_class: source.subject.is_textbook_used_in_class,
    prerequisite_knowledge_for_this_class:
      source.subject.prerequisite_knowledge_for_this_class,
    class_format: classFormatWithoutOther(source.subject.class_format),
    mode_class_format: null,
    course_college: [],
  },
});

const normalizeSportSubject = (
  source: Extract<SourceSubject, { type: "体育" }>,
): SportSubject => ({
  type: "体育",
  term: source.term,
  subject_category: source.subject_category,
  name: normalizeSportName(source.name),
  subject: {
    name: normalizeSportName(source.subject.name),
    num: source.subject.num,
    subject_code: source.subject.subject_code,
    subject_term: source.subject.subject_term,
    college_year: source.subject.college_year,
    comment: source.subject.comment.map(commentWithoutCode),
    proportion_of_experienced_students: aggregateScore(
      source.subject.proportion_of_experienced_students,
    ),
    consideration_for_inexperienced_students: aggregateScore(
      source.subject.consideration_for_inexperienced_students,
    ),
    credit_earnability: aggregateScore(source.subject.credit_earnability),
    exercise_intensity: aggregateScore(source.subject.exercise_intensity),
    male_to_female_ratio: aggregateScore(source.subject.male_to_female_ratio),
    recommendation_level_of_this_class: aggregateScore(
      source.subject.recommendation_level_of_this_class,
    ),
    required_purchases: source.subject.required_purchases,
    rain: null,
    final: null,
    weekly_assignments: null,
    overtime_assignments: null,
    activity: null,
  },
});

const subjects = z.array(subjectSchema).parse(summaryJson);

export const subjectMap: ReadonlyMap<string, Subject> = new Map<
  string,
  Subject
>(
  subjects.map<[string, Subject]>((source) => {
    if (source.type === "一般") {
      return [source.name, normalizeGeneralSubject(source)];
    }

    return [
      `${source.term}-${source.subject_category}-${normalizeSportName(source.name)}`,
      normalizeSportSubject(source),
    ];
  }),
);
