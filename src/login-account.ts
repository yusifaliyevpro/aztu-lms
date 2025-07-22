import { closeMainWindow, open } from "@raycast/api";
import { getSSOUrl } from "./lib/helpers";

export default async function Command() {
    const data = await getSSOUrl({ forLogin: true });
    if (data.status !== "error") {
        if (data.status === "new") await open(data.loginLink);
        else await open("https://lms.aztu.edu.az");
    } else console.log(data);
    await closeMainWindow({ clearRootSearch: true });
}
