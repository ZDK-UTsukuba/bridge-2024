import { summaryData } from "./summary2024spring";
import {
  aggregateScore,
  averageScore,
  classFormatWithoutOther,
  normalizeSportName,
} from "./subjectsDataTypes";
import type {
  GeneralSubject,
  SportSubject,
  Subject,
  SubjectComment,
} from "./subjectsDataTypes";

type ValueOf<T> = T[keyof T];

type SpecializedSource = ValueOf<(typeof summaryData)["専門・専門基礎"]>;
type GeneralSource = ValueOf<ValueOf<(typeof summaryData)["一般"]>>;
type SportSource = ValueOf<ValueOf<(typeof summaryData)["体育"]>>;

const basicComment = (
  comment: {
    recommendation_level_of_this_class: number;
    comment: string;
  },
  subjectCode: string | null,
): SubjectComment => ({
  subject_code: subjectCode,
  recommendation_level_of_this_class:
    comment.recommendation_level_of_this_class,
  comment: comment.comment,
});

const specializedSubject = (
  name: string,
  source: SpecializedSource,
): GeneralSubject => ({
  type: "一般",
  subject_category: "専門・専門基礎",
  affiliation: source.course_college.join(", "),
  name,
  subject: {
    name,
    num: null,
    subject_code: [],
    subject_term: "春学期",
    subject_affiliation: source.course_college.join(", "),
    subject_category: "専門・専門基礎",
    comment: source.comment.map((comment) => basicComment(comment, null)),
    teachers_email_response_evaluation: averageScore(
      source.teachers_email_response_evaluation,
    ),
    credit_earnability: averageScore(source.credit_earnability),
    credit_fairness: null,
    class_preparation_workload: averageScore(source.class_preparation_workload),
    class_difficulty_level: averageScore(source.class_difficulty_level),
    recommendation_level_of_this_class: averageScore(
      source.recommendation_level_of_this_class,
    ),
    are_materials_distributed_in_class:
      source.are_materials_distributed_in_class,
    is_textbook_used_in_class: source.is_textbook_used_in_class,
    prerequisite_knowledge_for_this_class:
      source.prerequisite_knowledge_for_this_class,
    class_format: classFormatWithoutOther(source.class_format),
    mode_class_format: null,
    course_college: source.course_college,
  },
});

const generalSubject = (
  name: string,
  subjectCategory: string,
  source: GeneralSource,
): GeneralSubject => ({
  type: "一般",
  subject_category: subjectCategory,
  affiliation: null,
  name,
  subject: {
    name: source.name,
    num: null,
    subject_code: [
      ...new Set(source.comment.map((comment) => comment.subject_number)),
    ],
    subject_term: "春学期",
    subject_affiliation: null,
    subject_category: subjectCategory,
    comment: source.comment.map((comment) =>
      basicComment(comment, comment.subject_number),
    ),
    teachers_email_response_evaluation: aggregateScore(
      source.teachers_email_response_evaluation,
    ),
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
    class_format: classFormatWithoutOther(source.class_format),
    mode_class_format: null,
    course_college: [],
  },
});

const sportSubject = (
  name: string,
  subjectCategory: string,
  subjectNumber: string,
  source: SportSource,
): SportSubject => ({
  type: "体育",
  term: "春学期",
  subject_category: subjectCategory,
  name: normalizeSportName(name),
  subject: {
    name: normalizeSportName(source.name),
    num: null,
    subject_code: [subjectNumber],
    subject_term: "春学期",
    college_year: null,
    comment: source.comment.map((comment) => basicComment(comment, null)),
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
  ...Object.entries(summaryData["専門・専門基礎"]).map<
    [string, GeneralSubject]
  >(([name, subject]) => [name, specializedSubject(name, subject)]),
  ...Object.entries(summaryData["一般"]).flatMap(
    ([subjectCategory, subjects]) =>
      Object.entries(subjects).map<[string, GeneralSubject]>(
        ([name, subject]) => [
          name,
          generalSubject(name, subjectCategory, subject),
        ],
      ),
  ),
  ...Object.entries(summaryData["体育"]).flatMap(
    ([subjectCategory, subjects]) =>
      Object.entries(subjects).map<[string, SportSubject]>(
        ([subjectNumber, subject]) => [
          `${normalizeSportName(subject.name)}-${subjectCategory}`,
          sportSubject(subject.name, subjectCategory, subjectNumber, subject),
        ],
      ),
  ),
]);
