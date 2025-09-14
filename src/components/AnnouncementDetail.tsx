import { useEffect, useState } from "react";
import { getAnnouncementContent } from "@/data/announcement";
import { Detail } from "@raycast/api";

export function AnnouncementDetail({ id, title }: { id: string; title: string }) {
    const [content, setContent] = useState<string | null>();

    useEffect(() => {
        const fetchContent = async () => {
            const data = await getAnnouncementContent(id);
            setContent(data?.content || null);
        };
        fetchContent();
    }, [id]);
    return <Detail markdown={`# ${title}\n\n${content || ""}`} />;
}
