import { commonHeaders } from "@/lib/constants";
import { getJWTToken } from "@/lib/login";
import { fetchWithCookies } from "@/lib/utils";

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
    if (!token) return null;
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

    if (!data.results) return null;

    return data;
}
