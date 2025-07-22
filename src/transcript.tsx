import { useEffect, useState } from "react";
import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { getTotalScores, TotalScore } from "./data/scores/getScores";
import SemesterDetail from "./components/SemesterDetails";

export default function Command() {
    const [totalScores, setTotalScores] = useState<TotalScore>();

    useEffect(() => {
        const fetchTotalScores = async () => {
            try {
                const data = await getTotalScores();
                setTotalScores(data);
            } catch {
                await showToast(Toast.Style.Failure, "Failed to fetch semester scores");
            }
        };
        fetchTotalScores();
    }, []);

    return (
        <List isLoading={totalScores === undefined} searchBarPlaceholder="Search semesters...">
            {totalScores?.results.map(semester => (
                <List.Item
                    key={semester.sem_code}
                    title={semester.semester_name}
                    accessories={[
                        {
                            text: `${semester.total_score} / ${semester.require_score} credits`,
                            tooltip: "Earned Credits",
                        },
                        { text: `${semester.avg_total2}`, tooltip: "Average Score" },
                    ]}
                    subtitle={`Subjects: ${semester.require_cnt}, Attended: ${semester.attend_cnt}`}
                    actions={
                        <ActionPanel>
                            <Action.Push
                                title="View Semester Details"
                                target={<SemesterDetail semCode={semester.sem_code} />}
                            />
                        </ActionPanel>
                    }
                />
            ))}

            {totalScores?.summary && (
                <List.Section title="Overall Summary">
                    <List.Item
                        title="Total Credits"
                        accessories={[{ text: `${totalScores.summary.t_require_score}` }]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard
                                    title="Copy"
                                    content={"Total Credits: " + totalScores.summary.t_require_score}
                                />
                            </ActionPanel>
                        }
                    />
                    <List.Item
                        title="Average Score (GPA)"
                        accessories={[{ text: `${totalScores.summary.t_avg_total.toFixed(1)}` }]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard
                                    title="Copy"
                                    content={"Average Score (GPA): " + totalScores.summary.t_avg_total.toFixed(1)}
                                />
                            </ActionPanel>
                        }
                    />
                    <List.Item
                        title="Attended Subjects"
                        accessories={[
                            { text: `${totalScores.summary.t_attend_cnt} / ${totalScores.summary.t_require_cnt}` },
                        ]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard
                                    title="Copy"
                                    content={
                                        "Attended Subjects: " +
                                        `${totalScores.summary.t_attend_cnt} / ${totalScores.summary.t_require_cnt}`
                                    }
                                />
                            </ActionPanel>
                        }
                    />
                </List.Section>
            )}
        </List>
    );
}
