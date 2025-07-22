import { useEffect, useState } from "react";
import { Action, ActionPanel, List, showToast, Toast } from "@raycast/api";
import { Announcement, getAnnouncements } from "./data/getAnnouncements";

export default function Command() {
    const [announcements, setAnnouncements] = useState<Announcement[]>();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch {
                await showToast(Toast.Style.Failure, "Failed to fetch semester scores");
            }
        };
        fetchAnnouncements();
    }, []);
    return (
        <List
            isLoading={announcements === undefined}
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
    );
}
