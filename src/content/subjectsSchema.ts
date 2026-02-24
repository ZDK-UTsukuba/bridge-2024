import { z } from "astro:content";
import subjectsMergedJson from "./class/subjects.merged.json";

type Terms = { text: "春学期"; code: "A" } | { text: "秋学期"; code: "B" };
type DaysOfWeek = "月" | "火" | "水" | "木" | "金" | "土" | "日" | "他";
type Periods = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TimeTable = {
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
export type ModuleTimeTable = Record<Module, readonly TimeTable[]>;

type Requisite = {
  id: string;
  name: string;
  hasLower: boolean;
} | null;

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
  code: string; // 科目番号
  name: string; // 科目名
  syllabusLatestLink: string | null; // シラバス最新リンク
  instructionalType: {
    value: InstructionalType | null;
    kdbRaw: string | null;
  }; // 授業方法
  credits: {
    value:
      | {
          type: "normal";
          value: number;
        }
      | {
          type: "none";
        }
      | {
          type: "unknown";
        }
      | null;
    kdbRaw: string | null;
  }; // 単位数
  year: {
    value:
      | {
          type: "normal";
          value: readonly number[];
        }
      | {
          type: "unknown";
        };
    kdbRaw: string | null;
    twinsRaw: string | null;
  }; // 標準履修年次
  terms: {
    term: Terms | null; // 学期
    module: string | null; // 実施学期
    weekdayAndPeriod: string | null; // 曜時限
    moduleTimeTable: ModuleTimeTable | null; // モジュール時間割

    twinsRaw: {
      term: string;
      module: string;
    } | null;
  };
  classroom: null; // 教室
  instructor: {
    value: string[];

    kdbRaw: string | null;
    twinsRaw: string | null;
  }; // 担当教員
  overview: string | null; // 授業概要
  remarks: string | null; // 備考
  auditor: string | null; // 科目等履修生申請可否
  conditionsForAuditors: string | null; // 申請条件
  exchangeStudent: string | null;
  conditionsForExchangeStudents: string | null; // 申請条件
  JaEnCourseName: string | null; // 英語(日本語)科目名
  parentNumber: string | null; // 科目コード
  parentCourseName: string | null; // 要件科目名

  affiliation: {
    name: string | null;
    code: string | null;

    twinsRaw: {
      name: string;
      code: string;
    } | null;
  };

  requisite: Requisite[];
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
const RequisiteSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    hasLower: z.boolean(),
  })
  .nullable();
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
  syllabusLatestLink: z.string().nullable(),
  instructionalType: z.object({
    value: InstructionalTypeSchema.nullable(),
    kdbRaw: z.string().nullable(),
  }),
  credits: z.object({
    value: z
      .union([
        z.object({
          type: z.literal("normal"),
          value: z.number(),
        }),
        z.object({ type: z.literal("none") }),
        z.object({ type: z.literal("unknown") }),
      ])
      .nullable(),
    kdbRaw: z.string().nullable(),
  }),
  year: z.object({
    value: z.union([
      z.object({
        type: z.literal("normal"),
        value: z.array(z.number()),
      }),
      z.object({ type: z.literal("unknown") }),
    ]),
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

  requisite: z.array(RequisiteSchema),
});

const SubjectsSchema = z.array(MergedSubjectSchema);

const parsedSubjects: readonly MergedSubject[] = (() => {
  try {
    return SubjectsSchema.parse(subjectsMergedJson);
  } catch (error) {
    // console.error("Failed to parse subjects:", JSON.stringify(error, null, 4));
    throw new Error("Failed to parse subjects", { cause: error });
  }
})();

export const subjectsData = parsedSubjects;
