import { closeMainWindow, open } from "@raycast/api";
import { getSSOUrl } from "./lib/login";

export default async function Command() {
    const ssoData = await getSSOUrl({ forLogin: true });
    if (ssoData) {
        if (ssoData.status === "new") await open(ssoData.loginLink);
        else await open("https://lms.aztu.edu.az");
    } else console.log(ssoData);
    await closeMainWindow({ clearRootSearch: true });
}
