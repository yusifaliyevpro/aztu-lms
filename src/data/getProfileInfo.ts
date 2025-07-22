import fetchCookie from "fetch-cookie";
import fetch from "node-fetch";
import { commonHeaders } from "../lib/constants";
import { getJWTToken } from "../lib/helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tough = require("tough-cookie");

const cookieJar = new tough.CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

export type ProfileInfo = {
    basicInfo: {
        userId: number;
        name: string;
        surname: string;
        fatherName: string;
        gender: string;
        phone: string | null;
        mobilePhone: string;
        address: string | null;
        birthday: string | null;
    };
    academicInfo: {
        course: string;
        status: string;
        registerType: string;
    };
    additionalInfo: {
        photo: null;
    };
};

export async function getProfileInfo() {
    const token = await getJWTToken();
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/profile", {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as ProfileInfo;

    if (!data.basicInfo) return await getProfileInfo();

    return data;
}
