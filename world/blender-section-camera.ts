import {
  BLENDER_CV_CAMERAS,
  BLENDER_ORBIT_TARGET,
  BLENDER_VIEW_FOV,
  BLENDER_VIEW_POSITION,
  EDUCATION_BACHELOR_CAMERA,
  EDUCATION_BACHELOR_CARD_ID,
  EDUCATION_CAMERA,
  EDUCATION_MENTOR_CAMERA,
  EDUCATION_MENTOR_CARD_ID,
  EDUCATION_SENAI_CAMERA,
  EDUCATION_SENAI_CARD_ID,
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

function clonePose(pose: CameraPose): CameraPose {
  return {
    position: [...pose.position],
    target: [...pose.target],
    fov: pose.fov ?? BLENDER_VIEW_FOV,
  };
}

function cloneSectionCameraPose(id: CvSectionId): CameraPose {
  const pose = BLENDER_CV_CAMERAS[id] ?? PROFILE_CAMERA_POSE;
  return clonePose(pose);
}

function resolveEducationCameraPose(openCardId: string | null): CameraPose {
  if (openCardId === EDUCATION_BACHELOR_CARD_ID) {
    return clonePose(EDUCATION_BACHELOR_CAMERA);
  }
  if (openCardId === EDUCATION_MENTOR_CARD_ID) {
    return clonePose(EDUCATION_MENTOR_CAMERA);
  }
  if (openCardId === EDUCATION_SENAI_CARD_ID) {
    return clonePose(EDUCATION_SENAI_CAMERA);
  }
  return clonePose(EDUCATION_CAMERA);
}

export function resolveBlenderCameraPose(
  focusRoomId: CvSectionId,
  jobId: ExperienceJobId,
  stageIndex: number,
  educationOpenCardId: string | null = null,
): CameraPose {
  if (focusRoomId === "experience") {
    return getExperienceCameraPose(jobId, stageIndex);
  }
  if (focusRoomId === "education") {
    return resolveEducationCameraPose(educationOpenCardId);
  }
  return cloneSectionCameraPose(focusRoomId);
}
