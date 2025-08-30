import { z } from "astro:content";
import subjectsMergedJson from "./class/subjects.merged.json";

type Terms = { text: "春学期"; code: "A" } | { text: "秋学期"; code: "B" };
type DaysOfWeek = "月" | "火" | "水" | "木" | "金" | "土" | "日" | "他";
type Periods = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type TimeTable = {
  day: DaysOfWeek; // 曜日
  period: Periods | null; // 時限
};
type Module =
  | "springA"
  | "springB"
  | "springC"
  | "summerVacation"
  | "fallA"
  | "fallB"
  | "fallC"
  | "springVacation";
type ModuleTimeTable = Record<Module, readonly TimeTable[]>;

type Hierarchy = readonly { value: string | null; text: string }[];

type InstructionalType = {
  text: string;
  flags: {
    講義: boolean;
    演習: boolean;
    "実習･実験･実技": boolean;
    "卒業論文･卒業研究等": boolean;
    その他: boolean;
  };
};

type MergedSubject = {
  code: string;
  name: string;
  instructionalType: {
    value: InstructionalType | null;
    kdbRaw: string | null;
  };
  credits: {
    value:
      | {
          type: "number";
          value: number;
        }
      | {
          type: "none";
        }
      | null;
    kdbRaw: string | null;
  };
  year: {
    value: number[];
    kdbRaw: string | null;
    twinsRaw: string | null;
  };
  terms: {
    term: Terms | null;
    module: string | null;
    weekdayAndPeriod: string | null;
    moduleTimeTable: ModuleTimeTable | null;

    twinsRaw: {
      term: string;
      module: string;
    } | null;
  };
  classroom: null;
  instructor: {
    value: string[];

    kdbRaw: string | null;
    twinsRaw: string | null;
  };
  overview: string | null;
  remarks: string | null;
  auditor: string | null;
  conditionsForAuditors: string | null;
  exchangeStudent: string | null;
  conditionsForExchangeStudents: string | null;
  JaEnCourseName: string | null;
  parentNumber: string | null;
  parentCourseName: string | null;

  affiliation: {
    name: string | null;
    code: string | null;

    twinsRaw: {
      name: string;
      code: string;
    } | null;
  };

  kdbDataUpdateDate: string | null;

  hierarchy: Hierarchy[];
};

const TermsSchema = z.union([
  z.object({ text: z.literal("春学期"), code: z.literal("A") }),
  z.object({ text: z.literal("秋学期"), code: z.literal("B") }),
]);

const DaysOfWeekSchema = z.enum([
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
  "日",
  "他",
]);
const PeriodsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);
const TimeTableSchema = z.object({
  day: DaysOfWeekSchema, // 曜日
  period: PeriodsSchema.nullable(), // 時限
});

const ModuleTimeTableSchema = z.object({
  springA: z.array(TimeTableSchema),
  springB: z.array(TimeTableSchema),
  springC: z.array(TimeTableSchema),
  summerVacation: z.array(TimeTableSchema),
  fallA: z.array(TimeTableSchema),
  fallB: z.array(TimeTableSchema),
  fallC: z.array(TimeTableSchema),
  springVacation: z.array(TimeTableSchema),
});
const HierarchySchema = z.array(
  z.object({ value: z.string().nullable(), text: z.string() }),
);
const InstructionalTypeSchema = z.object({
  text: z.string(),
  flags: z.object({
    講義: z.boolean(),
    演習: z.boolean(),
    "実習･実験･実技": z.boolean(),
    "卒業論文･卒業研究等": z.boolean(),
    その他: z.boolean(),
  }),
});
const MergedSubjectSchema = z.object({
  code: z.string(),
  name: z.string(),
  instructionalType: z.object({
    value: InstructionalTypeSchema.nullable(),
    kdbRaw: z.string().nullable(),
  }),
  credits: z.object({
    value: z
      .union([
        z.object({
          type: z.literal("number"),
          value: z.number(),
        }),
        z.object({ type: z.literal("none") }),
      ])
      .nullable(),
    kdbRaw: z.string().nullable(),
  }),
  year: z.object({
    value: z.array(z.number()),
    kdbRaw: z.string().nullable(),
    twinsRaw: z.string().nullable(),
  }),
  terms: z.object({
    term: TermsSchema.nullable(),
    module: z.string().nullable(),
    weekdayAndPeriod: z.string().nullable(),
    moduleTimeTable: ModuleTimeTableSchema.nullable(),

    twinsRaw: z
      .object({
        term: z.string(),
        module: z.string(),
      })
      .nullable(),
  }),
  classroom: z.null(),
  instructor: z.object({
    value: z.array(z.string()),

    kdbRaw: z.string().nullable(),
    twinsRaw: z.string().nullable(),
  }),
  overview: z.string().nullable(),
  remarks: z.string().nullable(),
  auditor: z.string().nullable(),
  conditionsForAuditors: z.string().nullable(),
  exchangeStudent: z.string().nullable(),
  conditionsForExchangeStudents: z.string().nullable(),
  JaEnCourseName: z.string().nullable(),
  parentNumber: z.string().nullable(),
  parentCourseName: z.string().nullable(),

  affiliation: z.object({
    name: z.string().nullable(),
    code: z.string().nullable(),

    twinsRaw: z
      .object({
        name: z.string(),
        code: z.string(),
      })
      .nullable(),
  }),

  kdbDataUpdateDate: z.string().nullable(),

  hierarchy: z.array(HierarchySchema),
});

const SubjectsSchema = z.array(MergedSubjectSchema);

const parsedSubjects: readonly MergedSubject[] =
  SubjectsSchema.parse(subjectsMergedJson);

export const subjectsData = parsedSubjects;
