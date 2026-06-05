import {
  BLENDER_ORBIT_TARGET,
  BLENDER_VIEW_FOV,
  BLENDER_VIEW_POSITION,
} from "./blender-camera";
import { getExperienceCameraPose } from "./experience-cameras";
import type { ExperienceJobId } from "./experience-cameras";
import type { CameraPose, CvSectionId } from "./types";

/** Pose da hero / profile no mundo Blender. */
export const PROFILE_CAMERA_POSE: CameraPose = {
  position: [...BLENDER_VIEW_POSITION],
  target: [...BLENDER_ORBIT_TARGET],
  fov: BLENDER_VIEW_FOV,
};

export function resolveBlenderCameraPose(
  focusRoomId: CvSectionId,
  jobId: ExperienceJobId,
  stageIndex: number,
): CameraPose {
  if (focusRoomId === "experience") {
    return getExperienceCameraPose(jobId, stageIndex);
  }
  return PROFILE_CAMERA_POSE;
}
