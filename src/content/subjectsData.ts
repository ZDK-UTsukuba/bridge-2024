import { summaryData } from './summary_merged';

type valueof<T> = T[keyof T];

export const subjectMap = new Map<
    string,
    {
        type: "専門・専門基礎";
        name: string;
        subject: valueof<(typeof summaryData)["専門・専門基礎"]>;
    } | {
        type: "一般";
        name: string;
        subject_category: string;
        subject: valueof<valueof<(typeof summaryData)["一般"]>>;
    } | {
        type: "体育";
        name: string;
        subject_category: string;
        subject_number: string;
        subject: valueof<valueof<(typeof summaryData)["体育"]>>;
    }
>([
    ...[...Object.entries(summaryData["専門・専門基礎"])].map<
        [
            string,
            {
                type: "専門・専門基礎";
                name: string;
                subject: valueof<(typeof summaryData)["専門・専門基礎"]>;
            },
        ]
    >(([name, subject]) => [
        name,
        {
            type: "専門・専門基礎",
            name,
            subject,
        },
    ]),
    ...[...Object.entries(summaryData["一般"])].flatMap(
        ([subject_category, subjects]) =>
            [...Object.entries(subjects)].map<
                [
                    string,
                    {
                        type: "一般";
                        name: string;
                        subject_category: string;
                        subject: valueof<valueof<(typeof summaryData)["一般"]>>;
                    },
                ]
            >(([subject_name, subject]) => [
                subject_name,
                {
                    type: "一般",
                    name: subject_name,
                    subject_category,
                    subject,
                },
            ]),
    ),
    ...[...Object.entries(summaryData["体育"])].flatMap(
        ([subject_category, subjects]) =>
            [...Object.entries(subjects)].map<
                [
                    string,
                    {
                        type: "体育";
                        name: string;
                        subject_category: string;
                        subject_number: string;
                        subject: valueof<valueof<(typeof summaryData)["体育"]>>;
                    },
                ]
            >(([subject_number, subject]) => [
                `${subject.name}-${subject_category}`,
                {
                    type: "体育",
                    name: subject.name,
                    subject_category,
                    subject_number,
                    subject,
                },
            ]),
    ),
]);
