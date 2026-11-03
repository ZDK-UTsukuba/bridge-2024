import { z } from "astro:content";
import summaryJson from "./class/summary2025spring.json";
import {
  basicCommentSchema,
  modernGeneralSurveyShape,
  sportSurveyShape,
} from "./summarySchemaParts";

import {
  aggregateScore,
  classFormatWithOther,
  normalizeSportName,
} from "./subjectsDataTypes";
import type {
  GeneralSubject,
  SportSubject,
  Subject,
  SubjectComment,
} from "./subjectsDataTypes";

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

const summaryData = summarySchema.parse(summaryJson);

type ValueOf<T> = T[keyof T];

type GeneralSource = ValueOf<ValueOf<ValueOf<(typeof summaryData)["一般"]>>>;
type SportSource = ValueOf<ValueOf<ValueOf<(typeof summaryData)["体育"]>>>;

const commentWithoutCode = (comment: {
  recommendation_level_of_this_class: number;
  comment: string;
}): SubjectComment => ({
  subject_code: null,
  recommendation_level_of_this_class:
    comment.recommendation_level_of_this_class,
  comment: comment.comment,
});

const generalSubject = (
  name: string,
  subjectCategory: string,
  affiliation: string,
  source: GeneralSource,
): GeneralSubject => ({
  type: "一般",
  subject_category: subjectCategory,
  affiliation,
  name,
  subject: {
    name: source.name,
    num: source.num,
    subject_code: source.subject_code,
    subject_term: source.subject_term,
    subject_affiliation: source.subject_affiliation,
    subject_category: source.subject_category,
    comment: source.comment.map(commentWithoutCode),
    teachers_email_response_evaluation: null,
    credit_earnability: aggregateScore(source.credit_earnability),
    credit_fairness: null,
    class_preparation_workload: aggregateScore(
      source.class_preparation_workload,
    ),
    class_difficulty_level: aggregateScore(source.class_difficulty_level),
    recommendation_level_of_this_class: aggregateScore(
      source.recommendation_level_of_this_class,
    ),
    are_materials_distributed_in_class:
      source.are_materials_distributed_in_class,
    is_textbook_used_in_class: source.is_textbook_used_in_class,
    prerequisite_knowledge_for_this_class:
      source.prerequisite_knowledge_for_this_class,
    class_format: classFormatWithOther(source.class_format),
    mode_class_format: classFormatWithOther(source.mode_class_format),
    course_college: [],
  },
});

const sportSubject = (
  name: string,
  term: string,
  subjectCategory: string,
  source: SportSource,
): SportSubject => ({
  type: "体育",
  term,
  subject_category: subjectCategory,
  name: normalizeSportName(name),
  subject: {
    name: normalizeSportName(source.name),
    num: source.num,
    subject_code: source.subject_code,
    subject_term: source.subject_term,
    college_year: source.college_year,
    comment: source.comment.map(commentWithoutCode),
    proportion_of_experienced_students: aggregateScore(
      source.proportion_of_experienced_students,
    ),
    consideration_for_inexperienced_students: aggregateScore(
      source.consideration_for_inexperienced_students,
    ),
    credit_earnability: aggregateScore(source.credit_earnability),
    exercise_intensity: aggregateScore(source.exercise_intensity),
    male_to_female_ratio: aggregateScore(source.male_to_female_ratio),
    recommendation_level_of_this_class: aggregateScore(
      source.recommendation_level_of_this_class,
    ),
    required_purchases: source.required_purchases,
    rain: source.rain,
    final: source.final,
    weekly_assignments: source.weekly_assignments,
    overtime_assignments: source.overtime_assignments,
    activity: source.activity,
  },
});

export const subjectMap: ReadonlyMap<string, Subject> = new Map<
  string,
  Subject
>([
  ...Object.entries(summaryData["一般"]).flatMap(
    ([subjectCategory, affiliations]) =>
      Object.entries(affiliations).flatMap(([affiliation, subjects]) =>
        Object.entries(subjects).map<[string, GeneralSubject]>(
          ([name, subject]) => [
            name,
            generalSubject(name, subjectCategory, affiliation, subject),
          ],
        ),
      ),
  ),
  ...Object.entries(summaryData["体育"]).flatMap(([term, categories]) =>
    Object.entries(categories).flatMap(([subjectCategory, subjects]) =>
      Object.entries(subjects).map<[string, SportSubject]>(
        ([name, subject]) => [
          `${term}-${subjectCategory}-${normalizeSportName(name)}`,
          sportSubject(name, term, subjectCategory, subject),
        ],
      ),
    ),
  ),
]);
