import { commonHeaders } from "@/lib/constants";
import { getJWTToken } from "@/lib/login";
import { fetchWithCookies } from "@/lib/utils";

export type Announcement = { id: string; title: string; creator: string; created_at: string; hit: string };
export async function getAnnouncements() {
    const token = await getJWTToken();
    if (!token) return null;
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/announcements", {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as Announcement[];

    if (!(data instanceof Array)) return null;

    return data;
}

export type AnnouncementContent = { content: string };
export async function getAnnouncementContent(id: string) {
    const token = await getJWTToken();
    if (!token) return null;
    const response = await fetchWithCookies(`https://api-lms.aztu.edu.az/api/announcements/${id}`, {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    });
    const data = (await response.json()) as AnnouncementContent;

    if (!data) return null;

    return data;
}
