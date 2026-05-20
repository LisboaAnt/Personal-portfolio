import type { TimelineEvent } from "@/lib/profile-timeline";
import type { CvSectionId } from "./types";

export const WORK_PROJECT_SECTION: Record<string, CvSectionId> = {
  vittahub: "experience",
  ussin: "education",
  ufc: "projects",
};

export function isCvSectionId(value: string): value is CvSectionId {
  return (
    value === "profile" ||
    value === "experience" ||
    value === "projects" ||
    value === "education" ||
    value === "skills" ||
    value === "contact"
  );
}

/** @deprecated */
export const isRoomId = isCvSectionId;

export function timelineEventToRoom(event: Pick<TimelineEvent, "id" | "kind">): CvSectionId {
  if (event.kind === "profile") return "profile";
  if (event.kind === "skills") return "skills";
  if (event.kind === "education") return "education";
  if (event.kind === "experience") {
    return WORK_PROJECT_SECTION[event.id] ?? "experience";
  }
  return "education";
}
