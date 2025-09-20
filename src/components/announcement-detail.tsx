import { useEffect, useState } from "react";
import { getAnnouncementContent } from "@/data/announcement";
import { Detail, showToast, Toast } from "@raycast/api";

export function AnnouncementDetail({ id, title }: { id: string; title: string }) {
    const [content, setContent] = useState<string | null>(null);
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getAnnouncementContent(id);
                setContent(data?.content || null);
            } catch (error) {
                console.log("Failed to fetch announcement content:", error);
                await showToast({ style: Toast.Style.Failure, title: "Failed to fetch announcement content" });
            }
        };
        fetchContent();
    }, [id]);

    return <Detail isLoading={!content} markdown={`# ${title}\n\n${content || ""}`} />;
}
