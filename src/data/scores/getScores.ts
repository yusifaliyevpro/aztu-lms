import { commonHeaders } from "@/lib/constants";
import { getJWTToken } from "@/lib/login";
import { fetchWithCookies } from "@/lib/utils";

export type TotalScore = {
    results: {
        sem_code: string;
        attend_cnt: string;
        require_cnt: string;
        total_score: string;
        require_score: string;
        div_score: string;
        avg_total: string;
        avg_score: string;
        semester_name: string;
        avg_total2: number;
    }[];
    summary: {
        t_attend_cnt: number;
        t_require_cnt: number;
        t_total_score: number;
        t_require_score: number;
        t_avg_total: number;
        t_div_score: number;
        t_avg_score: number;
        unfinished_count: number;
    };
};

export async function getTotalScores() {
    const token = await getJWTToken();
    if (!token) return null;
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/scores", {
        method: "GET",
        body: null,
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as TotalScore;

    if (!data.results) return null;

    return data;
}
