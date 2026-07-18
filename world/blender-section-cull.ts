import type { Object3D } from "three";
import { Mesh, Vector3 } from "three";
import { BLENDER_CV_CAMERAS } from "@/world/blender-camera";
import { PROFILE_CAMERA_POSE } from "@/world/blender-section-camera";
import type { CvSectionId } from "@/world/types";

const _pos = new Vector3();
const _anchorA = new Vector3();
const _anchorB = new Vector3();

function setSectionCullAnchor(sectionId: CvSectionId, out: Vector3) {
  const pose =
    sectionId === "profile" ? PROFILE_CAMERA_POSE : (BLENDER_CV_CAMERAS[sectionId] ?? PROFILE_CAMERA_POSE);
  out.set(pose.target[0], pose.target[1], pose.target[2]);
}

/** Esconde meshes longe do alvo da secção activa (reduz triângulos desenhados). */
export function applyBlenderSectionCull(
  root: Object3D,
  focusRoomId: CvSectionId,
  radius: number,
  secondarySectionId?: CvSectionId | null,
) {
  setSectionCullAnchor(focusRoomId, _anchorA);

  const radiusSq = radius * radius;
  let secondaryRadiusSq = 0;
  if (secondarySectionId) {
    setSectionCullAnchor(secondarySectionId, _anchorB);
    secondaryRadiusSq = radius * 1.35 * radius * 1.35;
  }

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.getWorldPosition(_pos);
    const inPrimary = _pos.distanceToSquared(_anchorA) <= radiusSq;
    const inSecondary =
      secondarySectionId != null && _pos.distanceToSquared(_anchorB) <= secondaryRadiusSq;
    obj.visible = inPrimary || inSecondary;
  });
}
