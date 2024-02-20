import * as React from "react";
import { useEffect } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Typography } from "@mui/joy";

import { LifeEvent } from "../lib/LifeEvent";
import { calculateAge } from "../lib/calculate-age";
import EventTimelineDot, {
  EventTimelineDotVariant,
} from "./timeline/EventTimelineDot";
import { AlertType, useAlertContext } from "./AlertContext";

interface BasicTimelineProps {
  lifeEvents: LifeEvent[];
  categoryColors: Record<string, string>;
  showAgeDOB?: Date;
}

export default function BasicTimeline(props: BasicTimelineProps) {
  const { setAlertInfo } = useAlertContext();

  useEffect(() => {
    setAlertInfo({
      type: AlertType.Warning,
      title: "Don't Forget to Backup",
      message:
        "Lifeline is still in development. To avoid losing your work, regularly use the 'Export' option to back up your life events to CSV.",
    });
  }, []);
  const age = (event: LifeEvent, dob: Date): string => {
    const eventDate = new Date(
      event.year,
      event.month ? event.month - 1 : 0,
      event.day ? event.day : 1,
    );
    const ageStr = calculateAge(eventDate, dob);
    return `${ageStr} old`;
  };

  return (
    <React.Fragment>
      <Timeline>
        {props.lifeEvents.map((event) => (
          <TimelineItem key={event.id}>
            <TimelineOppositeContent color="text.secondary">
              <Typography level={event.minor ? "body-xs" : "body-sm"}>
                {event.year}
                {event.month ? "-" + `${event.month}`.padStart(2, "0") : ""}
              </Typography>
              {props.showAgeDOB && (
                <Typography level="body-xs">
                  <em>{age(event, props.showAgeDOB)}</em>
                </Typography>
              )}
              <Typography level="body-xs">{event.category.name}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <EventTimelineDot
                event={event}
                variant={EventTimelineDotVariant.Emoji}
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography level={event.minor ? "body-xs" : "title-sm"}>
                {event.title}
              </Typography>
              <Typography level="body-xs">{event.notes}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </React.Fragment>
  );
}
