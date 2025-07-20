import { useEffect, useState } from "react"
import { Action, ActionPanel, List } from "@raycast/api"
import { Announcement, getAnnouncements } from "./data/getAnnouncements"

export default function Command() {
    const [announcements, setAnnouncements] = useState<Announcement[]>()
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true)
            const data = await getAnnouncements()
            setAnnouncements(data)
            setLoading(false)
        }
        fetchAnnouncements()
    }, [])
    return (
        <List
            isLoading={isLoading}
            navigationTitle="Search Announcements"
            searchBarPlaceholder="Search AzTU LMS Announcements"
        >
            {announcements?.map(item => (
                <List.Item
                    key={item.id}
                    title={item.title}
                    subtitle={item.created_at}
                    actions={
                        <ActionPanel>
                            <Action.OpenInBrowser url={`https://lms.aztu.edu.az/announcements/${item.id}`} />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    )
}
