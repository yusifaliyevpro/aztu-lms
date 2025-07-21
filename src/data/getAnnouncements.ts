import fetchCookie from "fetch-cookie"
import fetch from "node-fetch"
import { commonHeaders } from "../lib/constants"
import { getJWTToken } from "../lib/helpers"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tough = require("tough-cookie")

const cookieJar = new tough.CookieJar()
const fetchWithCookies = fetchCookie(fetch, cookieJar)

export type Announcement = { id: string; title: string; creator: string; created_at: string; hit: string }
export async function getAnnouncements() {
    const token = await getJWTToken()
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/announcements", {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
    })
    const data = (await response.json()) as Announcement[]

    return data
}
