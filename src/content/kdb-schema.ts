/*
import { z } from 'astro:content';
import kdbJson from './class/kdb.json';

type KdbType = {
    updated: string,
    subject: [
        number: string,
        name: string,
        instructionalType: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8",
        credits: string,
        standardRegistrationYear: string,
        term: string,
        period: string,
        room: string,
        instructor: string,
        abstract: string,
        remarks: string,
    ][],
};

const KdBSchema = z.object({
    "updated": z.string(),
    "subject": z.array(
        z.tuple([
            z.string(),
            z.string(),
            z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8"]),
            z.string(),
            z.string(),
            z.string(),
            z.string(),
            z.string(),
            z.string(),
            z.string(),
            z.string(),
        ]),
    ),
});

const parsedKdb: KdbType = KdBSchema.parse(kdbJson);

export const kdbData = {
    updated: parsedKdb.updated,
    subject: parsedKdb.subject.map(v => ({
        number: v[0],
        name: v[1],
        instructionalType: v[2],
        credits: v[3],
        standardRegistrationYear: v[4],
        term: v[5],
        period: v[6],
        room: v[7],
        instructor: v[8],
        abstract: v[9],
        remarks: v[10],
    })),
};
*/