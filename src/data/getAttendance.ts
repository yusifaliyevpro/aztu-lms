import { commonHeaders } from "@/lib/constants";
import { getJWTToken } from "@/lib/login";
import { fetchWithCookies } from "@/lib/utils";

export type Attendance = {
    lecture_id: string;
    lecture_name: string;
    total_weeks: number;
    attended_weeks: number;
    absent_weeks: number;
    attendance_percent: string;
    attendance_score: number;
};

export async function getAttendance() {
    const token = await getJWTToken();
    if (!token) return null;
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/attendance", {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as Attendance[];

    if (!(data instanceof Array)) return null;

    return data;
}
