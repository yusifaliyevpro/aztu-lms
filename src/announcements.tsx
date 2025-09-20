import { useEffect, useState } from "react";
import { Action, ActionPanel, Icon, List, showToast, Toast } from "@raycast/api";
import { Announcement, getAnnouncements } from "./data/announcement";
import { AnnouncementDetail } from "./components/announcement-detail";

export default function Command() {
    const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch {
                await showToast(Toast.Style.Failure, "Failed to fetch announcements");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

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
                            <Action.Push
                                title="View Announcement Details"
                                target={<AnnouncementDetail title={item.title} id={item.id} />}
                            />
                        </ActionPanel>
                    }
                />
            ))}
            {!isLoading && (!announcements || announcements.length === 0) && (
                <List.EmptyView icon={Icon.Bell} title="No Announcements" description="No announcements found." />
            )}
        </List>
    );
}
