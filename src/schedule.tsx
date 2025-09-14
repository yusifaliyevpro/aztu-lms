import { useEffect, useState } from "react";
import { getSchedule, Schedule } from "./data/getSchedule";
import { Action, ActionPanel, Color, Icon, List, showToast, Toast } from "@raycast/api";
import { getWeek } from "date-fns";

const DAY_TRANSLATION: Record<string, string> = {
    "Bazar ertəsi": "Monday",
    "Çərşənbə axşamı": "Tuesday",
    Çərşənbə: "Wednesday",
    "Cümə axşamı": "Thursday",
    Cümə: "Friday",
    Şənbə: "Saturday",
    Bazar: "Sunday",
};

const getLectureTypeColor = (lectureType: string): Color => {
    if (lectureType === "Mühazirə") return Color.Green;
    if (lectureType === "Məşğələ") return Color.Blue;
    if (lectureType === "Laboratoriya") return Color.Orange;
    return Color.SecondaryText;
};

type WeekFilter = "current" | "upper" | "lower";

export default function Command() {
    const [schedule, setSchedule] = useState<Schedule | null>();
    const [isLoading, setIsLoading] = useState(true);
    const [weekFilter, setWeekFilter] = useState<WeekFilter>("current");

    const isCurrentWeekUpper = getWeek(new Date(), { weekStartsOn: 1 }) % 2 === 0;
    const currentWeekType = isCurrentWeekUpper ? "upper" : "lower";

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await getSchedule();
                setSchedule(data);
            } catch {
                await showToast(Toast.Style.Failure, "Failed to fetch schedule");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const shouldShowClass = (cls: Schedule["data"][number][0]) => {
        if (cls.week_type_name === "Daimi") return true;

        if (weekFilter === "current") {
            if (currentWeekType === "upper" && cls.week_type_name === "Üst həftə") return true;
            if (currentWeekType === "lower" && cls.week_type_name === "Alt həftə") return true;
            return false;
        }

        if (weekFilter === "upper") {
            return cls.week_type_name === "Üst həftə";
        }

        if (weekFilter === "lower") {
            return cls.week_type_name === "Alt həftə";
        }

        return true;
    };

    const getCurrentDayClasses = () => {
        if (!schedule?.data) return null;

        const today = new Date();
        const dayNames = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
        const currentDayAz = dayNames[today.getDay()];

        const todayClasses = schedule.data[currentDayAz] || [];
        return todayClasses.filter(shouldShowClass);
    };

    const getWeekTypeTitle = () => {
        if (weekFilter === "current") {
            return `Current Week (${currentWeekType === "upper" ? "Upper" : "Lower"})`;
        }
        if (weekFilter === "upper") return "Upper Week Schedule";
        if (weekFilter === "lower") return "Lower Week Schedule";
        return "Schedule";
    };

    const todayClasses = getCurrentDayClasses();

    const createFullScheduleText = () => {
        if (!schedule?.data) return "";

        let scheduleText = `# ${getWeekTypeTitle()}\n\n`;

        Object.entries(schedule.data).forEach(([dayAz, classes]) => {
            const dayEn = DAY_TRANSLATION[dayAz] || dayAz;
            const filteredClasses = classes.filter(shouldShowClass);

            if (filteredClasses.length === 0) return;

            scheduleText += `## ${dayEn} (${dayAz})\n\n`;

            filteredClasses.forEach((cls, index) => {
                scheduleText += `**${cls.time}** - ${cls.subject}\n`;
                scheduleText += `- Teacher: ${cls.teacher}\n`;
                scheduleText += `- Type: ${cls.lecture_type_name}\n`;
                scheduleText += `- Room: ${cls.room || "TBA"}\n`;
                if (index < filteredClasses.length - 1) scheduleText += "\n";
            });

            scheduleText += "\n---\n\n";
        });

        return scheduleText;
    };

    return (
        <List
            isLoading={isLoading}
            searchBarPlaceholder="Search classes and teachers..."
            searchBarAccessory={
                <List.Dropdown
                    tooltip="Week Filter"
                    value={weekFilter}
                    onChange={newValue => setWeekFilter(newValue as WeekFilter)}
                >
                    <List.Dropdown.Item
                        value="current"
                        title={`Current Week (${currentWeekType === "upper" ? "Upper" : "Lower"})`}
                        icon={Icon.Calendar}
                    />
                    <List.Dropdown.Item value="upper" title="Upper Week" icon={Icon.ChevronUp} />
                    <List.Dropdown.Item value="lower" title="Lower Week" icon={Icon.ChevronDown} />
                </List.Dropdown>
            }
        >
            {/* Today's Overview - only show if viewing current week and has classes today */}
            {weekFilter === "current" && todayClasses && todayClasses.length > 0 && (
                <List.Section title="📅 Today's Classes">
                    <List.Item
                        title="Today's Overview"
                        subtitle={`${todayClasses.length} classes scheduled`}
                        icon={{
                            source: Icon.Camera,
                            tintColor: Color.Blue,
                        }}
                        accessories={[
                            {
                                text: `${todayClasses[0]?.time.split(" - ")[0]} - ${todayClasses[todayClasses.length - 1]?.time.split(" - ")[1]}`,
                                icon: Icon.Clock,
                            },
                        ]}
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard
                                    title="Copy Today's Schedule"
                                    content={todayClasses
                                        .map(cls => `${cls.time}: ${cls.subject} (${cls.teacher})`)
                                        .join("\n")}
                                    icon={Icon.Clipboard}
                                />
                            </ActionPanel>
                        }
                    />
                </List.Section>
            )}

            {/* Weekly Schedule */}
            {schedule?.data &&
                Object.entries(schedule.data).map(([dayAz, classes]) => {
                    const dayEn = DAY_TRANSLATION[dayAz] || dayAz;
                    const filteredClasses = classes.filter(shouldShowClass);
                    const isToday =
                        dayAz ===
                        ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"][
                            new Date().getDay()
                        ];

                    // Don't show empty days
                    if (filteredClasses.length === 0) return null;

                    return (
                        <List.Section
                            key={dayAz}
                            title={`${isToday ? "🔹 " : ""}${dayEn} (${dayAz})${isToday ? " - Today" : ""}`}
                        >
                            {filteredClasses.map((cls, index) => (
                                <List.Item
                                    key={`${dayAz}-${index}`}
                                    title={cls.subject.slice(0, 35) + (cls.subject.length > 35 ? "..." : "")}
                                    subtitle={`${cls.time} • ${cls.teacher}`}
                                    icon={{
                                        source: Icon.Book,
                                        tintColor: getLectureTypeColor(cls.lecture_type_name),
                                    }}
                                    accessories={[
                                        ...(cls.room
                                            ? [
                                                  {
                                                      text: cls.room
                                                          ? cls.room.slice(-3) + "-" + cls.room.slice(0, 1)
                                                          : cls.room,
                                                      icon: {
                                                          source: Icon.Building,
                                                          tintColor: Color.SecondaryText,
                                                      },
                                                  },
                                              ]
                                            : []),
                                        {
                                            text: cls.lecture_type_name,
                                            icon: {
                                                source: Icon.Dot,
                                                tintColor: getLectureTypeColor(cls.lecture_type_name),
                                            },
                                        },
                                    ]}
                                    actions={
                                        <ActionPanel>
                                            <Action.CopyToClipboard
                                                title="Copy Class Info"
                                                content={`${cls.subject}\nTime: ${cls.time}\nTeacher: ${cls.teacher}\nType: ${cls.lecture_type_name}\nRoom: ${cls.room || "TBA"}`}
                                                icon={Icon.CopyClipboard}
                                            />
                                            <Action.CopyToClipboard
                                                title="Copy Teacher Name"
                                                content={cls.teacher}
                                                icon={Icon.Person}
                                            />
                                            <Action.CopyToClipboard
                                                title="Copy Full Schedule"
                                                content={createFullScheduleText()}
                                                icon={Icon.Clipboard}
                                            />
                                        </ActionPanel>
                                    }
                                />
                            ))}
                        </List.Section>
                    );
                })}

            {!isLoading && (!schedule || !schedule.data || Object.keys(schedule.data).length === 0) && (
                <List.EmptyView
                    icon={Icon.Calendar}
                    title="No Schedule Available"
                    description="No classes found for this week. Please check back later."
                />
            )}
        </List>
    );
}
