import { closeMainWindow, LocalStorage } from "@raycast/api";
import { JWT_TOKEN_STORAGE_KEY, LAST_LMS_LOGIN_LINK_KEY, LAST_LMS_LOGIN_TIMESTAMP_KEY } from "./lib/constants";

export default async function Command() {
    await LocalStorage.setItem(LAST_LMS_LOGIN_LINK_KEY, "");
    await LocalStorage.setItem(JWT_TOKEN_STORAGE_KEY, "");
    await LocalStorage.setItem(LAST_LMS_LOGIN_TIMESTAMP_KEY, "");

    await closeMainWindow({ clearRootSearch: true });
}
