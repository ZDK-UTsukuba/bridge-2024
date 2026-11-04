import { subjectMap as subjectMap2023 } from "./subjectsData2023";
import { subjectMap as subjectMap2024spring } from "./subjectsData2024spring";
import { subjectMap as subjectMap2025spring } from "./subjectsData2025spring";
import { subjectMap as subjectMap2025fall } from "./subjectsData2025fall";
import { subjectMap as subjectMap2026spring } from "./subjectsData2026spring";
import type {
  GeneralSubjectData,
  GroupedSubject,
  SportSubjectData,
  Subject,
  SubjectPeriod,
} from "./subjectsDataTypes";



export type subj =
  | {
      readonly type: "一般";
      readonly subject_category: string;
      readonly affiliation: string | null;
      readonly name: string;
      readonly subject: GroupedSubject<GeneralSubjectData>;
    }
  | {
      readonly type: "体育";
      readonly term: string | null;
      readonly subject_category: string;
      readonly name: string;
      readonly subject: GroupedSubject<SportSubjectData>;
    };

type PeriodSubject = {
  readonly key: string;
  readonly period: SubjectPeriod;
  readonly value: Subject;
};

type AggregatedSubjectParameters = Readonly<
  Record<string, Readonly<Partial<Record<SubjectPeriod, unknown>>>>
>;

type AggregatedSubject =
  | {
      readonly type: "一般";
      readonly subject_category: string;
      readonly affiliation: string | null;
      readonly name: string;
      readonly subject: AggregatedSubjectParameters;
    }
  | {
      readonly type: "体育";
      readonly term: string | null;
      readonly subject_category: string;
      readonly name: string;
      readonly subject: AggregatedSubjectParameters;
    };

const mergeParameters = (
  current: AggregatedSubjectParameters,
  period: SubjectPeriod,
  parameters: object,
): AggregatedSubjectParameters => {
  const updates = Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => {
      const valuesByPeriod = current[key] ?? {};

      if (period in valuesByPeriod) {
        throw new Error(`${key}.${period} is already registered`);
      }

      return [key, { ...valuesByPeriod, [period]: value }];
    }),
  );

  return { ...current, ...updates };
};

const mergeSubject = (
  current: AggregatedSubject | undefined,
  next: PeriodSubject,
): AggregatedSubject => {
  if (next.value.type === "一般") {
    if (current && current.type !== "一般") {
      throw new Error(`${next.key} is registered as ${current.type}`);
    }

    return {
      type: "一般",
      subject_category: next.value.subject_category,
      affiliation: next.value.affiliation,
      name: next.value.name,
      subject: mergeParameters(
        current?.subject ?? {},
        next.period,
        next.value.subject,
      ),
    };
  }

  if (current && current.type !== "体育") {
    throw new Error(`${next.key} is registered as ${current.type}`);
  }

  return {
    type: "体育",
    term: next.value.term,
    subject_category: next.value.subject_category,
    name: next.value.name,
    subject: mergeParameters(
      current?.subject ?? {},
      next.period,
      next.value.subject,
    ),
  };
};

const mergeIntoMap = (
  current: ReadonlyMap<string, AggregatedSubject>,
  next: PeriodSubject,
) =>
  new Map<string, AggregatedSubject>([
    ...current,
    [next.key, mergeSubject(current.get(next.key), next)],
  ]);

const subjectsByPeriod: readonly PeriodSubject[] = [
  ...Array.from(subjectMap2023, ([key, value]) => ({
    key,
    period: "2023" as const,
    value,
  })),
  ...Array.from(subjectMap2024spring, ([key, value]) => ({
    key,
    period: "2024spring" as const,
    value,
  })),
  ...Array.from(subjectMap2025spring, ([key, value]) => ({
    key,
    period: "2025spring" as const,
    value,
  })),
  ...Array.from(subjectMap2025fall, ([key, value]) => ({
    key,
    period: "2025fall" as const,
    value,
  })),
  ...Array.from(subjectMap2026spring, ([key, value]) => ({
    key,
    period: "2026spring" as const,
    value,
  })),
];

const aggregatedSubjectMap: ReadonlyMap<string, AggregatedSubject> =
  subjectsByPeriod.reduce(mergeIntoMap, new Map<string, AggregatedSubject>());

export const subjectMap: ReadonlyMap<string, subj> = new Map<string, subj>(
  Array.from(aggregatedSubjectMap, ([key, subject]) => [key, subject as subj]),
);
