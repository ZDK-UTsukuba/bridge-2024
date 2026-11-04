export type ScoreValue = {
  readonly type: "aggregate";
  readonly sum: number;
  readonly count: number;
};

export type SubjectComment = {
  readonly subject_code: string | null;
  readonly recommendation_level_of_this_class: number;
  readonly comment: string;
};

export type BooleanSummary = {
  readonly True: number;
  readonly False: number;
};

export type BooleanSummaryWithDetail = BooleanSummary & {
  readonly detail: readonly string[];
};

export type ClassFormatWithoutOther = {
  readonly type: "without_other";
  readonly 回答人数: number;
  readonly 講義: number;
  readonly グループワーク: number;
  readonly 発表: number;
  readonly パネルディスカッション: number;
  readonly 対話: number;
  readonly オンデマンド: number;
  readonly レポート提出のみ: number;
};

export type ClassFormatWithOther = {
  readonly type: "with_other";
  readonly 講義: number;
  readonly グループワーク: number;
  readonly 発表: number;
  readonly other: readonly string[];
};

export type ClassFormat = ClassFormatWithoutOther | ClassFormatWithOther;

export type GeneralSubjectData = {
  readonly name: string;
  readonly num: number | null;
  readonly subject_code: readonly string[];
  readonly subject_term: string | null;
  readonly subject_affiliation: string | null;
  readonly subject_category: string;
  readonly comment: readonly SubjectComment[];
  readonly teachers_email_response_evaluation: ScoreValue | null;
  readonly credit_earnability: ScoreValue;
  readonly credit_fairness: ScoreValue | null;
  readonly class_preparation_workload: ScoreValue;
  readonly class_difficulty_level: ScoreValue;
  readonly recommendation_level_of_this_class: ScoreValue;
  readonly are_materials_distributed_in_class: BooleanSummary;
  readonly is_textbook_used_in_class: BooleanSummary;
  readonly prerequisite_knowledge_for_this_class: readonly string[];
  readonly class_format: ClassFormat | null;
  readonly mode_class_format: ClassFormatWithOther | null;
  readonly course_college: readonly string[];
};

export type SportSubjectData = {
  readonly name: string;
  readonly num: number | null;
  readonly subject_code: readonly string[];
  readonly subject_term: string | null;
  readonly college_year: string | null;
  readonly comment: readonly SubjectComment[];
  readonly proportion_of_experienced_students: ScoreValue;
  readonly consideration_for_inexperienced_students: ScoreValue;
  readonly credit_earnability: ScoreValue;
  readonly exercise_intensity: ScoreValue;
  readonly male_to_female_ratio: ScoreValue;
  readonly recommendation_level_of_this_class: ScoreValue;
  readonly required_purchases: BooleanSummaryWithDetail;
  readonly rain: BooleanSummaryWithDetail | null;
  readonly final: BooleanSummaryWithDetail | null;
  readonly weekly_assignments: BooleanSummaryWithDetail | null;
  readonly overtime_assignments: BooleanSummaryWithDetail | null;
  readonly activity: readonly string[] | null;
};

export type GeneralSubject = {
  readonly type: "一般";
  readonly subject_category: string;
  readonly affiliation: string | null;
  readonly name: string;
  readonly subject: GeneralSubjectData;
};

export type SportSubject = {
  readonly type: "体育";
  readonly term: string | null;
  readonly subject_category: string;
  readonly name: string;
  readonly subject: SportSubjectData;
};

export type Subject = GeneralSubject | SportSubject;

export const subjectPeriods = [
  "2023",
  "2024spring",
  "2025spring",
  "2025fall",
  "2026spring",
] as const;

export type SubjectPeriod = (typeof subjectPeriods)[number];

export type ValuesByPeriod<Value> = Partial<Record<SubjectPeriod, Value>>;

export type GroupedSubject<SubjectData extends object> = {
  readonly [Key in keyof SubjectData]: ValuesByPeriod<SubjectData[Key]>;
};

export const aggregateScore = (value: {
  readonly sum: number;
  readonly count: number;
}): ScoreValue => ({
  type: "aggregate",
  sum: value.sum,
  count: value.count,
});

export const calcScoreAverage = (score: ScoreValue): number | null => {
  if (score.count === 0) return null;
  return score.sum / score.count;
};

export const calcScoreAverageByPeriod = (
  scores: ValuesByPeriod<ScoreValue>,
): number | null => {
  return calcScoreAverage(aggregateScore(
    Object.values(scores).reduce((acc, score) =>  ({
      sum: acc.sum + score.sum,
      count: acc.count + score.count,
    }), { sum: 0, count: 0 })
  ));
};

export const getScoreCount = (score: ScoreValue): number => score.count;

export const classFormatWithoutOther = (
  value: Omit<ClassFormatWithoutOther, "type">,
): ClassFormatWithoutOther => ({
  type: "without_other",
  ...value,
});

export const classFormatWithOther = (
  value: Omit<ClassFormatWithOther, "type">,
): ClassFormatWithOther => ({
  type: "with_other",
  ...value,
});

export const normalizeSportName = (name: string) =>
  name.replaceAll("（", "(").replaceAll("）", ")");
