import { commonHeaders } from "@/lib/constants";
import { getJWTToken } from "@/lib/login";
import { fetchWithCookies } from "@/lib/utils";

export type Schedule = {
    status: "success" | "error";
    data: Record<
        string,
        Array<{
            hour_id: number;
            time: string;
            room: string | null;
            subject: string;
            teacher: string;
            group: string;
            lecture_type: number;
            lecture_type_name: string;
            week_type: number;
            week_type_name: string;
        }>
    >;
};

export async function getSchedule() {
    const token = await getJWTToken();
    if (!token) return null;
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/schedule", {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as Schedule;

    if (data.status === "error") return null;

    return data;
}
