import { Action, ActionPanel, Detail, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { getSemesterScores, SemesterScores } from "@/data/scores/getSemesterScores";

export default function SemesterDetail({ semCode }: { semCode: string }) {
    const [rows, setRows] = useState<SemesterScores | null>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSemesterScores = async () => {
            try {
                const data = await getSemesterScores(semCode);
                setRows(data);
            } catch {
                await showToast(Toast.Style.Failure, "Failed to load semester details");
            } finally {
                setTimeout(() => setIsLoading(false), 6000);
            }
        };
        fetchSemesterScores();
    }, [semCode]);

    const semesterName = rows?.results[0]?.semester_name || "Semester";

    const markdownTable = rows
        ? `
### ${semesterName}

| Type     | Subject             | Credit | Pre-exam | Exam | Total | Grade | Repeated |
|----------|---------------------|--------|----------|------|-------|-------|----------|
${rows?.results
    .map(
        r =>
            `| ${r.major_type} | ${r.lecture_name} | ${r.score} | ${r.total_score_new} | ${r.last_score} | ${r.total_score} | ${r.grade} | ${r.again_yn === "Y" ? "Yes" : "No"} |`,
    )
    .join("\n")} 
`
        : null;

    return (
        <Detail
            isLoading={isLoading}
            markdown={markdownTable}
            actions={
                rows && (
                    <ActionPanel>
                        <Action.CopyToClipboard title="Copy as Markdown" content={markdownTable!} />
                    </ActionPanel>
                )
            }
        />
    );
}
