import { commonHeaders } from "@/lib/constants";
import { getJWTToken } from "@/lib/login";
import { fetchWithCookies } from "@/lib/utils";

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
    if (!token) return null;
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/profile", {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as ProfileInfo;

    if (!data.basicInfo) return null;

    return data;
}
