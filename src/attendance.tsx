import { useEffect, useState } from "react";
import { List, showToast, Toast, Color, Icon, Action, ActionPanel } from "@raycast/api";
import { Attendance, getAttendance } from "./data/getAttendance";
import { AttendanceDetail } from "./components/attendance-detail";

export default function Command() {
    const [attendance, setAttendance] = useState<Attendance[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getAttendance();
                setAttendance(data);
            } catch {
                await showToast(Toast.Style.Failure, "Failed to fetch attendance");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const getAttendanceColor = (percent: string): Color => {
        const numericPercent = parseInt(percent.replace("%", ""));
        if (numericPercent >= 85) return Color.Green;
        if (numericPercent >= 75) return Color.Orange;
        return Color.Red;
    };

    const getAttendanceIcon = (percent: string): Icon => {
        const numericPercent = parseInt(percent.replace("%", ""));
        if (numericPercent >= 85) return Icon.CheckCircle;
        if (numericPercent >= 75) return Icon.ExclamationMark;
        return Icon.XMarkCircle;
    };

    const getStatusText = (percent: string): string => {
        const numericPercent = parseInt(percent.replace("%", ""));
        if (numericPercent >= 85) return "Excellent";
        if (numericPercent >= 75) return "Good";
        return "Exam Ineligible";
    };

    return (
        <List isLoading={isLoading} searchBarPlaceholder="Search lectures...">
            {attendance?.map(lecture => (
                <List.Item
                    key={lecture.lecture_id}
                    title={lecture.lecture_name}
                    icon={{
                        source: getAttendanceIcon(lecture.attendance_percent),
                        tintColor: getAttendanceColor(lecture.attendance_percent),
                    }}
                    accessories={[
                        { text: lecture.attendance_percent },
                        {
                            text: getStatusText(lecture.attendance_percent),
                            icon: {
                                source: Icon.Dot,
                                tintColor: getAttendanceColor(lecture.attendance_percent),
                            },
                        },
                        {
                            text: `Score: ${lecture.attendance_score}/10`,
                            icon: Icon.Star,
                        },
                    ]}
                    actions={
                        <ActionPanel>
                            <Action.Push
                                title="View Details"
                                target={<AttendanceDetail lecture={lecture} />}
                                icon={Icon.Eye}
                            />
                        </ActionPanel>
                    }
                />
            ))}
            {!isLoading && (!attendance || attendance.length === 0) && (
                <List.EmptyView
                    icon={Icon.Calendar}
                    title="No Attendance Data"
                    description="No attendance records found for this semester."
                />
            )}
        </List>
    );
}
