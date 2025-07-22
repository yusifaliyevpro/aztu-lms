import fetchCookie from "fetch-cookie";
import fetch from "node-fetch";
import { commonHeaders } from "../../lib/constants";
import { getJWTToken } from "../../lib/helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tough = require("tough-cookie");

const cookieJar = new tough.CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

export type SemesterScores = {
    results: Array<{
        semester_name: string;
        major_type: string;
        lecture_name: string;
        score: string;
        total_score_new: number;
        last_score: string;
        total_score: string;
        grade: string;
        again_yn: string;
    }>;
};

export async function getSemesterScores(semCode: string) {
    const token = await getJWTToken();
    const response = await fetchWithCookies(`https://api-lms.aztu.edu.az/api/scores/${semCode}`, {
        method: "GET",
        body: null,
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as SemesterScores;

    if (!data.results) return await getSemesterScores(semCode);

    return data;
}
