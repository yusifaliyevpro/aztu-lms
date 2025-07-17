import { Detail, getPreferenceValues, showToast, Toast, open, LocalStorage } from "@raycast/api"
import { useEffect, useState, useRef } from "react"
import fetchCookie from "fetch-cookie"
import fetch from "node-fetch"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tough = require("tough-cookie")

type Preferences = {
    username: string
    password: string
}

const CACHE_KEY_TIMESTAMP = "aztu_last_login_time"
const ONE_HOUR_MS = 60 * 60 * 1000

export default function Command() {
    const [result, setResult] = useState<"success" | "fail" | "loading">("loading")
    const [message, setMessage] = useState("Checking last login...")
    const hasOpenedRef = useRef(false)

    useEffect(() => {
        const checkLastLoginAndProceed = async () => {
            try {
                const lastLoginTimestamp = await LocalStorage.getItem<string>(CACHE_KEY_TIMESTAMP)
                const now = Date.now()
                const last = lastLoginTimestamp ? parseInt(lastLoginTimestamp) : 0

                if (now - last < ONE_HOUR_MS) {
                    if (!hasOpenedRef.current) {
                        hasOpenedRef.current = true
                        console.log("Opening LMS directly (cached): https://lms.aztu.edu.az/")
                        await open("https://lms.aztu.edu.az/")
                        await showToast({ title: "Opened LMS (cached)", style: Toast.Style.Success })
                        setResult("success")
                        setMessage("Opened LMS without re-login.")
                    }
                    return
                }
            } catch (error) {
                console.warn("Failed to read last login time:", error)
                // continue to login
            }

            await performLogin()
        }

        const performLogin = async () => {
            setMessage("Performing login...")

            const preferences: Preferences = getPreferenceValues()
            const { username, password } = preferences

            const cookieJar = new tough.CookieJar()
            const fetchWithCookies = fetchCookie(fetch, cookieJar)

            try {
                const loginRes = await fetchWithCookies("https://sso.aztu.edu.az/Home/Login", {
                    method: "POST",
                    redirect: "manual",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "Mozilla/5.0",
                        Origin: "https://sso.aztu.edu.az",
                        Referer: "https://sso.aztu.edu.az/",
                    },
                    body: `UserId=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`,
                })

                const location = loginRes.headers.get("location")
                if (!location) {
                    await showToast({
                        title: "Login failed",
                        message: "No redirect location found.",
                        style: Toast.Style.Failure,
                    })
                    setResult("fail")
                    setMessage("Login failed. Could not retrieve redirect URL.")
                    return
                }

                const nextUrl = location.startsWith("http") ? location : `https://sso.aztu.edu.az${location}`

                const finalRes = await fetchWithCookies(nextUrl, {
                    headers: { "User-Agent": "Mozilla/5.0" },
                })

                const html = await finalRes.text()
                const match = html.match(/<a[^>]+href="([^"]*admin_menu\/login\.php\?param=[^"]+)"[^>]*>/i)

                if (match && match[1]) {
                    await LocalStorage.setItem(CACHE_KEY_TIMESTAMP, Date.now().toString())

                    if (!hasOpenedRef.current) {
                        hasOpenedRef.current = true
                        console.log("Login success, opening LMS: https://lms.aztu.edu.az/")
                        await open("https://lms.aztu.edu.az/")
                        await showToast({ title: "Login successful", style: Toast.Style.Success })
                    }

                    setResult("success")
                    setMessage("Login successful. LMS opened.")
                } else {
                    await showToast({
                        title: "Login failed",
                        message: "No LMS link found after login.",
                        style: Toast.Style.Failure,
                    })
                    setResult("fail")
                    setMessage("Login succeeded, but LMS link could not be found.")
                }
            } catch (error) {
                console.error("Login error:", error)
                await showToast({
                    title: "Unexpected error",
                    message: String(error),
                    style: Toast.Style.Failure,
                })
                setResult("fail")
                setMessage("An error occurred during login.")
            }
        }

        checkLastLoginAndProceed()
    }, [])

    return (
        <Detail
            markdown={
                result === "loading" ? "🔄 Logging in..." : result === "success" ? `✅ ${message}` : `❌ ${message}`
            }
        />
    )
}
