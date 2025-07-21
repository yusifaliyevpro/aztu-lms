import fetchCookie from "fetch-cookie"
import fetch from "node-fetch"
import { commonHeaders } from "../../lib/constants"
import { getJWTToken } from "../../lib/helpers"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tough = require("tough-cookie")

const cookieJar = new tough.CookieJar()
const fetchWithCookies = fetchCookie(fetch, cookieJar)

export type Score = {
    results: {
        sem_code: string
        attend_cnt: string
        require_cnt: string
        total_score: string
        require_score: string
        div_score: string
        avg_total: string
        avg_score: string
        semester_name: string
        avg_total2: number
    }[]
    summary: {
        t_attend_cnt: number
        t_require_cnt: number
        t_total_score: number
        t_require_score: number
        t_avg_total: number
        t_div_score: number
        t_avg_score: number
        unfinished_count: number
    }
}

export async function getScores() {
    const token = await getJWTToken()
    const response = await fetchWithCookies("https://api-lms.aztu.edu.az/api/scores", {
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            ...commonHeaders,
        },
        body: null,
        method: "GET",
    })
    const data = (await response.json()) as Score
    console.log(data)
    return data
}
