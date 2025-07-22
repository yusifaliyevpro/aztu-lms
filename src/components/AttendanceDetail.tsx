import { Detail } from "@raycast/api";
import { Attendance } from "../data/getAttendance";

export function AttendanceDetail({ lecture }: { lecture: Attendance }) {
    const getStatusText = (percent: string): string => {
        const numericPercent = parseInt(percent.replace("%", ""));
        if (numericPercent >= 85) return "Excellent";
        if (numericPercent >= 75) return "Good";
        return "Exam Ineligible";
    };

    return (
        <Detail
            markdown={`# ${lecture.lecture_name}

## Attendance Summary
- **Attendance Rate:** ${lecture.attendance_percent}
- **Attendance Score:** ${lecture.attendance_score}/10 points
- **Status:** ${getStatusText(lecture.attendance_percent)}

## Weekly Breakdown
- **Total Weeks:** ${lecture.total_weeks}
- **Attended Weeks:** ${lecture.attended_weeks}
- **Absent Weeks:** ${lecture.absent_weeks}

---

### Progress Bar
${"█".repeat(Math.floor(parseInt(lecture.attendance_percent.replace("%", "")) / 10))}${"░".repeat(10 - Math.floor(parseInt(lecture.attendance_percent.replace("%", "")) / 10))} ${lecture.attendance_percent}

### Exam Eligibility Status
${
    parseInt(lecture.attendance_percent.replace("%", "")) >= 85
        ? "✅ **Safe Zone!** Your attendance is excellent and well above the requirement."
        : parseInt(lecture.attendance_percent.replace("%", "")) >= 75
          ? "⚠️ **Risky Zone!** You can take the exam but be careful not to miss more classes."
          : "❌ **Cannot Take Exam!** Your attendance is below 75% - you are not eligible for the exam."
}

---
**Note:** You need at least 75% attendance to be eligible for the exam.
`}
        />
    );
}
