import { closeMainWindow, open, showToast, Toast } from "@raycast/api";
import { getSSOUrl } from "./lib/login";

export default async function Command() {
    const loadingToast = await showToast({ title: "Logging Account...", style: Toast.Style.Animated });

    try {
        const data = await getSSOUrl({ forLogin: true });
        if (data) {
            if (data.status === "new") await open(data.loginLink);
            else await open("https://lms.aztu.edu.az");
        } else {
            throw new Error(data);
        }
    } catch (error) {
        console.log(error);
        await showToast({ title: "Failed to get Login URL", message: "Try again!" });
    }

    await loadingToast.hide();
    await closeMainWindow({ clearRootSearch: true });
}
