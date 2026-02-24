import { subjectMap } from "./subjectsData2025";
import { subjectsData } from "./subjectsSchema";
import type { ModuleTimeTable, TimeTable } from "./subjectsSchema";

// subjectMapの値の型を取得
type SubjectMapValue = NonNullable<ReturnType<typeof subjectMap.get>>;
type SubjectData = SubjectMapValue["subject"];

// 平均値を計算（省略可能なプロパティに対応）
const calcAve = (
  numOrObj: number | { sum?: number; count?: number } | undefined,
): number => {
  if (typeof numOrObj === "number") {
    return numOrObj;
  }
  if (!numOrObj || numOrObj.sum === undefined || numOrObj.count === undefined) {
    return 0;
  }
  return Number.isNaN(numOrObj.sum / numOrObj.count)
    ? 0
    : numOrObj.sum / numOrObj.count;
};

// 安全にプロパティにアクセスする補助関数
const safeGetProperty = <T extends Record<string, unknown>>(
  obj: T,
  key: string,
): { sum?: number; count?: number } | undefined => {
  return key in obj
    ? (obj[key] as { sum?: number; count?: number })
    : undefined;
};

// 評価数を取得
const getEvaluationCount = (subject: SubjectData): number => {
  const prop = safeGetProperty(subject, "recommendation_level_of_this_class");
  return prop?.count || 0;
};

// 評価類似度を計算（0-1の範囲）
const calculateEvaluationSimilarity = (
  subj1: SubjectData,
  subj2: SubjectData,
  type1: string,
  type2: string,
): number => {
  const metrics1: number[] = [];
  const metrics2: number[] = [];

  if (type1 === "一般" && type2 === "一般") {
    // 一般科目同士
    metrics1.push(
      calcAve(safeGetProperty(subj1, "credit_earnability")),
      calcAve(safeGetProperty(subj1, "class_preparation_workload")),
      calcAve(safeGetProperty(subj1, "class_difficulty_level")),
      calcAve(safeGetProperty(subj1, "recommendation_level_of_this_class")),
    );
    metrics2.push(
      calcAve(safeGetProperty(subj2, "credit_earnability")),
      calcAve(safeGetProperty(subj2, "class_preparation_workload")),
      calcAve(safeGetProperty(subj2, "class_difficulty_level")),
      calcAve(safeGetProperty(subj2, "recommendation_level_of_this_class")),
    );
  } else if (type1 === "体育" && type2 === "体育") {
    // 体育科目同士
    metrics1.push(
      calcAve(safeGetProperty(subj1, "credit_earnability")),
      calcAve(safeGetProperty(subj1, "recommendation_level_of_this_class")),
      calcAve(safeGetProperty(subj1, "proportion_of_experienced_students")),
      calcAve(
        safeGetProperty(subj1, "consideration_for_inexperienced_students"),
      ),
      calcAve(safeGetProperty(subj1, "exercise_intensity")),
    );
    metrics2.push(
      calcAve(safeGetProperty(subj2, "credit_earnability")),
      calcAve(safeGetProperty(subj2, "recommendation_level_of_this_class")),
      calcAve(safeGetProperty(subj2, "proportion_of_experienced_students")),
      calcAve(
        safeGetProperty(subj2, "consideration_for_inexperienced_students"),
      ),
      calcAve(safeGetProperty(subj2, "exercise_intensity")),
    );
  } else {
    // 異なるタイプ同士（一般と体育）
    // 共通する評価項目のみを使用
    metrics1.push(
      calcAve(safeGetProperty(subj1, "credit_earnability")),
      calcAve(safeGetProperty(subj1, "recommendation_level_of_this_class")),
    );
    metrics2.push(
      calcAve(safeGetProperty(subj2, "credit_earnability")),
      calcAve(safeGetProperty(subj2, "recommendation_level_of_this_class")),
    );
  }

  // ユークリッド距離を計算し、類似度に変換
  let sumSquaredDiff = 0;
  for (let i = 0; i < metrics1.length; i++) {
    const diff = metrics1[i] - metrics2[i];
    sumSquaredDiff += diff * diff;
  }
  const distance = Math.sqrt(sumSquaredDiff / metrics1.length);

  // 5段階評価なので、最大距離は5
  // 類似度 = 1 - (距離 / 最大距離)
  return Math.max(0, 1 - distance / 5);
};

// 時程類似度を計算（0-1の範囲）
const calculateScheduleSimilarity = (
  moduleTimeTable1: ModuleTimeTable | null,
  moduleTimeTable2: ModuleTimeTable | null,
): number => {
  // 両方とも時程データがない場合
  if (!moduleTimeTable1 && !moduleTimeTable2) {
    return 0.5;
  }

  // 片方のみ時程データがない場合
  if (!moduleTimeTable1 || !moduleTimeTable2) {
    return 0;
  }

  // 全モジュールのタイムテーブルを結合
  const getAllTimeTables = (mtt: ModuleTimeTable): TimeTable[] => {
    const modules: (keyof ModuleTimeTable)[] = [
      "springA",
      "springB",
      "springC",
      "summerVacation",
      "fallA",
      "fallB",
      "fallC",
      "springVacation",
    ];
    return modules.flatMap((m) => mtt[m] || []);
  };

  const timeTables1 = getAllTimeTables(moduleTimeTable1);
  const timeTables2 = getAllTimeTables(moduleTimeTable2);

  if (timeTables1.length === 0 || timeTables2.length === 0) {
    return 0;
  }

  // 完全一致（同じ曜日・時限）をチェック
  let exactMatches = 0;
  let moduleMatches = 0;

  for (const tt1 of timeTables1) {
    for (const tt2 of timeTables2) {
      // 完全一致
      if (
        tt1.day === tt2.day &&
        tt1.period === tt2.period &&
        tt1.period !== null
      ) {
        exactMatches++;
      }
      // 曜日のみ一致
      else if (tt1.day === tt2.day && tt1.day !== "他") {
        moduleMatches++;
      }
    }
  }

  // 完全一致がある場合は高得点
  if (exactMatches > 0) {
    return 1.0;
  }

  // 曜日一致がある場合は中得点
  if (moduleMatches > 0) {
    return 0.6;
  }

  // モジュール単位で一致をチェック
  const modules: (keyof ModuleTimeTable)[] = [
    "springA",
    "springB",
    "springC",
    "fallA",
    "fallB",
    "fallC",
  ];

  for (const module of modules) {
    const m1 = moduleTimeTable1[module];
    const m2 = moduleTimeTable2[module];
    if (m1 && m2 && m1.length > 0 && m2.length > 0) {
      // 同じモジュールで開講している
      return 0.4;
    }
  }

  return 0;
};

// KDBデータから科目名に対応するmoduleTimeTableを取得
const getModuleTimeTable = (subjectName: string): ModuleTimeTable | null => {
  const kdbs = subjectsData.filter((v) => v.name === subjectName);
  if (kdbs.length === 0) {
    return null;
  }
  // 最初のKDBデータの時程を使用
  return kdbs[0].terms.moduleTimeTable;
};

// KDBデータから科目名に対応する所属のリストを取得
const getAffiliations = (subjectName: string): Set<string> => {
  const kdbs = subjectsData.filter((v) => v.name === subjectName);
  const affiliations = new Set<string>();

  for (const kdb of kdbs) {
    if (kdb.affiliation.name) {
      affiliations.add(kdb.affiliation.name);
    }
  }

  return affiliations;
};

// 所属の一致度を計算
const calculateAffiliationBonus = (
  affiliations1: Set<string>,
  affiliations2: Set<string>,
): number => {
  if (affiliations1.size === 0 || affiliations2.size === 0) {
    return 1.0; // 所属情報がない場合はボーナスなし
  }

  // 共通する所属があるかチェック
  for (const aff1 of affiliations1) {
    if (affiliations2.has(aff1)) {
      return 1.5; // 同じ所属がある場合は1.5倍
    }
  }

  return 1.0; // 異なる所属の場合はボーナスなし
};

// 類似度スコアを計算
interface SimilarityScore {
  subjectId: string;
  score: number;
  details: {
    evalSimilarity: number;
    scheduleSimilarity: number;
    baseScore: number;
    typeBonus: number;
    affiliationBonus: number;
    countAdjustment: number;
    evaluationCount: number;
  };
}

const calculateSimilarityScore = (
  subjectId1: string,
  subject1: SubjectMapValue,
  subjectId2: string,
  subject2: SubjectMapValue,
): SimilarityScore | null => {
  // 自分自身は除外
  if (subjectId1 === subjectId2) {
    return null;
  }

  const type1 = subject1.type;
  const type2 = subject2.type;

  // 評価類似度を計算
  const evalSimilarity = calculateEvaluationSimilarity(
    subject1.subject,
    subject2.subject,
    type1,
    type2,
  );

  // 時程類似度を計算
  const schedule1 = getModuleTimeTable(subject1.name);
  const schedule2 = getModuleTimeTable(subject2.name);
  const scheduleSimilarity = calculateScheduleSimilarity(schedule1, schedule2);

  // 基本スコア（評価40%、時程60%）
  const baseScore = evalSimilarity * 0.4 + scheduleSimilarity * 0.6;

  // タイプ一致ボーナス
  const typeBonus = type1 === type2 ? 2.0 : 1.0;

  // 所属一致ボーナス（1.5倍）
  const affiliations1 = getAffiliations(subject1.name);
  const affiliations2 = getAffiliations(subject2.name);
  const affiliationBonus = calculateAffiliationBonus(
    affiliations1,
    affiliations2,
  );

  // 評価数調整係数（評価数が多いほど信頼性が高いが、増加速度を対数的に抑制）
  const count2 = getEvaluationCount(subject2.subject);
  // 評価数が多いほど係数が大きくなるが、対数的な増加で緩やかに（1.3で割って影響を抑制）
  const countAdjustment = (1 + Math.log10(count2 + 1)) / 1.3;

  // 最終スコア
  const finalScore = baseScore * typeBonus * affiliationBonus * countAdjustment;

  return {
    subjectId: subjectId2,
    score: finalScore,
    details: {
      evalSimilarity,
      scheduleSimilarity,
      baseScore,
      typeBonus,
      affiliationBonus,
      countAdjustment,
      evaluationCount: count2,
    },
  };
};

// 各科目に対して類似講義を計算
export const similarSubjectsMap = new Map<string, string[]>();
export const similarSubjectsDetailsMap = new Map<string, SimilarityScore[]>();

// ビルド時に全科目の類似講義を計算
for (const [subjectId1, subject1] of subjectMap.entries()) {
  const scores: SimilarityScore[] = [];

  for (const [subjectId2, subject2] of subjectMap.entries()) {
    const result = calculateSimilarityScore(
      subjectId1,
      subject1,
      subjectId2,
      subject2,
    );

    if (result && result.score > 0) {
      scores.push(result);
    }
  }

  // スコアでソートして上位3件を取得
  const top3Scores = scores.sort((a, b) => b.score - a.score).slice(0, 3);

  const top3Ids = top3Scores.map((s) => s.subjectId);

  similarSubjectsMap.set(subjectId1, top3Ids);
  similarSubjectsDetailsMap.set(subjectId1, top3Scores);

  // コンソールに詳細を出力（上位3件のみ）
  if (top3Scores.length > 0) {
    console.log(`\n# ${subjectId1} の類似講義`);
    top3Scores.forEach((item, index) => {
      console.log(`\n${index + 1}位: ${item.subjectId}`);
      console.log(`  評価類似度: ${item.details.evalSimilarity.toFixed(4)}`);
      console.log(
        `  時程類似度: ${item.details.scheduleSimilarity.toFixed(4)}`,
      );
      console.log(`  基本スコア: ${item.details.baseScore.toFixed(4)}`);
      console.log(`  タイプボーナス: ${item.details.typeBonus.toFixed(2)}倍`);
      console.log(
        `  所属ボーナス: ${item.details.affiliationBonus.toFixed(2)}倍`,
      );
      console.log(`  評価数: ${item.details.evaluationCount}件`);
      console.log(`  評価数調整: ${item.details.countAdjustment.toFixed(4)}`);
      console.log(`  最終スコア: ${item.score.toFixed(4)}`);
    });
  }
}
