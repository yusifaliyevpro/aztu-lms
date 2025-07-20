import { open } from "@raycast/api"
import { getJWTToken, getSSOUrl } from "./lib/helpers"
import { getAnnouncements } from "./data/getAnnouncements"

export default async function Command() {
    const data = await getSSOUrl()
    if (data.status !== "error") {
        if (data.status === "new") await open(data.loginLink)
        else await open("https://lms.aztu.edu.az")
    } else console.log(data)
}
