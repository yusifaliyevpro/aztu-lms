import { getPreferenceValues, LocalStorage } from "@raycast/api";
import {
    commonHeaders,
    IS_LOGINED_USING_WEB,
    JWT_TOKEN_STORAGE_KEY,
    JWT_TOKEN_TIMESTAMP_KEY,
    LAST_LMS_LOGIN_LINK_KEY,
    LAST_LMS_LOGIN_TIMESTAMP_KEY,
    ONE_HOUR_IN_MS,
} from "./constants";
import { fetchWithCookies } from "./utils";

export async function getSSOUrl({
    forLogin,
}: {
    forLogin: boolean;
}): Promise<{ status: "old" | "new"; loginLink: string } | undefined> {
    const now = Date.now();

    const lastLogin = parseInt((await LocalStorage.getItem<string>(LAST_LMS_LOGIN_TIMESTAMP_KEY)) || "0");
    const lastLoginLink = await LocalStorage.getItem<string>(LAST_LMS_LOGIN_LINK_KEY);
    const isLoginedUsingWeb = await LocalStorage.getItem<boolean>(IS_LOGINED_USING_WEB);

    if (lastLoginLink && now - lastLogin < ONE_HOUR_IN_MS) {
        if (forLogin) await LocalStorage.setItem(IS_LOGINED_USING_WEB, true);
        return { status: isLoginedUsingWeb ? "old" : "new", loginLink: lastLoginLink };
    }

    const { username, password } = getPreferenceValues<ExtensionPreferences>();

    const loginResponse = await fetchWithCookies("https://sso.aztu.edu.az/Home/Login", {
        method: "POST",
        redirect: "manual",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...commonHeaders,
        },
        body: `UserId=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`,
    });

    const redirectURL = loginResponse.headers.get("location");
    if (!redirectURL) {
        console.error("helpers.tsx: getSSOUrl() Redirect URL couldn't found!");
        return undefined;
    }

    const nextUrl = redirectURL.startsWith("http") ? redirectURL : `https://sso.aztu.edu.az${redirectURL}`;

    const followUpResponse = await fetchWithCookies(nextUrl, { headers: commonHeaders });

    const html = await followUpResponse.text();
    const match = html.match(/<a[^>]+href="([^"]*admin_menu\/login\.php\?param=[^"]+)"[^>]*>/i)!;

    const loginLink = match[1];

    const checkLoginLinkResponse = await fetchWithCookies(loginLink, { headers: commonHeaders });
    const text = await checkLoginLinkResponse.text();
    if (text === "\nuğursuz cəhd") {
        console.error("helpers.tsx: getSSOUrl() Uğursuz cəhd. Trying Again...!");
        return await getSSOUrl({ forLogin });
    }

    await LocalStorage.setItem(LAST_LMS_LOGIN_LINK_KEY, loginLink);
    await LocalStorage.setItem(LAST_LMS_LOGIN_TIMESTAMP_KEY, now.toString());
    await LocalStorage.setItem(IS_LOGINED_USING_WEB, forLogin);
    return { status: "new", loginLink: loginLink };
}

export async function generateJWTToken(): Promise<string | undefined> {
    const ssoData = await getSSOUrl({ forLogin: false });

    if (!ssoData) {
        console.error("helpers.tsx: generateJWTToken() SSO URL couldn't found!");
        return undefined;
    }

    const response = await fetchWithCookies(ssoData.loginLink, {
        method: "GET",
        redirect: "manual",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: "Bearer null",
            ...commonHeaders,
        },
    });

    const redirectURL = response.headers.get("location") as string[] | null;

    if (!redirectURL) {
        console.error("helpers.tsx: generateJWTToken() Redirect URL couldn't found!");
        return await generateJWTToken();
    }

    const tokenAPI_URL = new URL(redirectURL);
    tokenAPI_URL.host = "api-lms.aztu.edu.az";
    tokenAPI_URL.pathname = "api/login";

    const tokenRes = await fetchWithCookies(tokenAPI_URL.toString(), {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: "Bearer null",
            ...commonHeaders,
        },
    });

    const data = (await tokenRes.json()) as { status: "success"; token: string } | { status: false; message: string };
    if (data.status && data.status === "success") return data.token;
    else {
        console.error("helpers.tsx: generateJWTToken() Token couldn't found!");
        return undefined;
    }
}

export async function getJWTToken(): Promise<string | undefined> {
    const savedToken = await LocalStorage.getItem<string>(JWT_TOKEN_STORAGE_KEY);
    const savedTimeStr = await LocalStorage.getItem<string>(JWT_TOKEN_TIMESTAMP_KEY);
    const savedTime = parseInt(savedTimeStr || "0");

    const now = Date.now();
    if (savedToken && now - savedTime < ONE_HOUR_IN_MS) {
        return savedToken;
    }

    const newToken = await generateJWTToken();
    if (newToken) {
        const now = Date.now();
        await LocalStorage.setItem(JWT_TOKEN_STORAGE_KEY, newToken);
        await LocalStorage.setItem(JWT_TOKEN_TIMESTAMP_KEY, now.toString());
        return newToken;
    }

    return undefined;
}
