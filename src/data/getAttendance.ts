import fetchCookie from "fetch-cookie";
import fetch from "node-fetch";
import { commonHeaders } from "../lib/constants";
import { getJWTToken } from "../lib/helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tough = require("tough-cookie");

const cookieJar = new tough.CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

export type Attendance = {
    lecture_id: string;
    lecture_name: string;
    total_weeks: number;
    attended_weeks: number;
    absent_weeks: number;
    attendance_percent: string;
    attendance_score: number;
};

// [
//     {
//         lecture_id: "63895",
//         lecture_name: "Az\u0259rbaycan tarixi",
//         total_weeks: 30,
//         attended_weeks: 28,
//         absent_weeks: 1,
//         attendance_percent: "97%",
//         attendance_score: 10,
//     },
// ];

export async function getAttendance() {
    const token = await getJWTToken();
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/attendance", {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as Attendance[];

    if (!(data instanceof Array)) return await getAttendance();

    return data;
}
