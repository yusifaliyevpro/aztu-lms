import { closeMainWindow, open, showToast, Toast } from "@raycast/api";
import { getSSOUrl } from "@/lib/login";

export default async function Command() {
    const data = await getSSOUrl({ forLogin: true });
    if (data) {
        if (data.status === "new") await open(data.loginLink);
        else await open("https://lms.aztu.edu.az");
    } else {
        await showToast({ title: "Failed to get Login URL", style: Toast.Style.Failure });
    }

    await closeMainWindow({ clearRootSearch: true });
}
