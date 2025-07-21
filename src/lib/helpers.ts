import { getPreferenceValues, LocalStorage } from "@raycast/api"
import fetchCookie from "fetch-cookie"
import fetch from "node-fetch"
import {
    commonHeaders,
    JWT_TOKEN_STORAGE_KEY,
    JWT_TOKEN_TIMESTAMP_KEY,
    LAST_LMS_LOGIN_LINK_KEY,
    LAST_LMS_LOGIN_TIMESTAMP_KEY,
    ONE_HOUR_IN_MS,
    Preferences,
} from "./constants"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tough = require("tough-cookie")

const cookieJar = new tough.CookieJar()
const fetchWithCookies = fetchCookie(fetch, cookieJar)

export async function generateJWTToken(): Promise<string | undefined> {
    const ssoData = await getSSOUrl()
    if (ssoData.status === "error") return
    const response = await fetchWithCookies(ssoData.loginLink, {
        method: "GET",
        redirect: "manual",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: "Bearer null",
            ...commonHeaders,
        },
    })

    const redirectURL = response.headers.get("location")
    if (!redirectURL) return

    const tokenAPI_URL = new URL(redirectURL)
    tokenAPI_URL.host = "api-lms.aztu.edu.az"
    tokenAPI_URL.pathname = "api/login"

    const tokenRes = await fetchWithCookies(tokenAPI_URL.toString(), {
        method: "GET",
        headers: {
            authorization: "Bearer null",
            ...commonHeaders,
        },
    })
    const data = (await tokenRes.json()) as { status: "success"; token: string } | { status: false; message: string }
    if (data.status === "success") return data.token
}

type SSO_URL = Promise<{ status: "old" | "new"; loginLink: string } | { status: "error"; message: string }>
export async function getSSOUrl(): SSO_URL {
    const now = Date.now()

    const lastLogin = parseInt((await LocalStorage.getItem<string>(LAST_LMS_LOGIN_TIMESTAMP_KEY)) || "0")
    const lastLoginLink = (await LocalStorage.getItem<string>("sdksd")) as string
    if (lastLoginLink && now - lastLogin < ONE_HOUR_IN_MS) {
        return { status: "old", loginLink: lastLoginLink }
    }

    const { username, password } = getPreferenceValues<Preferences>()

    const loginResponse = await fetchWithCookies("https://sso.aztu.edu.az/Home/Login", {
        method: "POST",
        redirect: "manual",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...commonHeaders,
        },
        body: `UserId=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`,
    })

    const redirectURL = loginResponse.headers.get("location")
    if (!redirectURL) {
        console.log("Redirect URL couldn't found!")
        return { status: "error", message: "Redirect URL couldn't found" }
    }

    const nextUrl = redirectURL.startsWith("http") ? redirectURL : `https://sso.aztu.edu.az${redirectURL}`

    const followUpResponse = await fetchWithCookies(nextUrl, { headers: commonHeaders })

    const html = await followUpResponse.text()
    const match = html.match(/<a[^>]+href="([^"]*admin_menu\/login\.php\?param=[^"]+)"[^>]*>/i)!

    const loginLink = match[1]

    const checkLoginLinkResponse = await fetchWithCookies(loginLink, { headers: commonHeaders })
    if ((await checkLoginLinkResponse.text()) === "uğursuz cəhd") return await getSSOUrl()

    await LocalStorage.setItem(LAST_LMS_LOGIN_LINK_KEY, loginLink)
    await LocalStorage.setItem(LAST_LMS_LOGIN_TIMESTAMP_KEY, now.toString())
    return { status: "new", loginLink: loginLink }
}

export async function getJWTToken(): Promise<string | undefined> {
    const savedToken = await LocalStorage.getItem<string>(JWT_TOKEN_STORAGE_KEY)
    const savedTimeStr = await LocalStorage.getItem<string>(JWT_TOKEN_TIMESTAMP_KEY)
    const savedTime = parseInt(savedTimeStr || "0")

    const now = Date.now()
    if (savedToken && now - savedTime < ONE_HOUR_IN_MS) {
        return savedToken
    }

    const newToken = await generateJWTToken()
    if (newToken) {
        const now = Date.now()
        await LocalStorage.setItem(JWT_TOKEN_STORAGE_KEY, newToken)
        await LocalStorage.setItem(JWT_TOKEN_TIMESTAMP_KEY, now.toString())
        return newToken
    }

    return undefined
}
