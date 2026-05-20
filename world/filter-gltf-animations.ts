import * as THREE from "three";

/** Evita que animações do .glb movam a câmara do utilizador. */
export function filterCameraAnimationClips(clips: THREE.AnimationClip[]): THREE.AnimationClip[] {
  return clips
    .map((clip) => {
      const tracks = clip.tracks.filter((track) => {
        const name = track.name.toLowerCase();
        return !name.includes("camera") && !name.includes("câmara");
      });
      if (tracks.length === 0) return null;
      if (tracks.length === clip.tracks.length) return clip;
      return new THREE.AnimationClip(clip.name, clip.duration, tracks);
    })
    .filter((clip): clip is THREE.AnimationClip => clip !== null);
}
