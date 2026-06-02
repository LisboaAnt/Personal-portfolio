"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BLENDER_CV_CAMERAS, CV_SCROLL_SECTION_ORDER } from "@/world/blender-camera";
import type { CameraPose } from "@/world/types";
import { useWorldStore } from "@/stores/world-store";

const _pos = new THREE.Vector3();
const _posB = new THREE.Vector3();
const _target = new THREE.Vector3();
const _targetB = new THREE.Vector3();

function lerpPose(a: CameraPose, b: CameraPose, t: number): CameraPose {
  _pos.set(...a.position).lerp(_posB.set(...b.position), t);
  _target.set(...a.target).lerp(_targetB.set(...b.target), t);
  return {
    position: [_pos.x, _pos.y, _pos.z],
    target: [_target.x, _target.y, _target.z],
    fov: THREE.MathUtils.lerp(a.fov ?? 42, b.fov ?? 42, t),
  };
}

type ScrollRoot = HTMLElement | Window;

function getScrollRoot(): ScrollRoot {
  if (typeof document === "undefined") return window;
  const snap = document.querySelector<HTMLElement>(".cv-world-document");
  return snap ?? window;
}

function isElementScrollRoot(root: ScrollRoot): root is HTMLElement {
  return root !== window;
}

function getScrollTop(root: ScrollRoot): number {
  if (isElementScrollRoot(root)) return root.scrollTop;
  return window.scrollY;
}

function getScrollSegment(): { index: number; t: number } {
  if (typeof window === "undefined") return { index: 0, t: 0 };

  const root = getScrollRoot();
  const focal = getScrollTop(root) + window.innerHeight * 0.32;
  const tops = CV_SCROLL_SECTION_ORDER.map((id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    if (!isElementScrollRoot(root)) return el.offsetTop;
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return elRect.top - rootRect.top + root.scrollTop;
  });

  for (let i = 0; i < tops.length - 1; i++) {
    const start = tops[i]!;
    const end = tops[i + 1]!;
    if (focal >= start && focal < end) {
      const span = end - start || 1;
      return { index: i, t: (focal - start) / span };
    }
  }

  if (focal >= tops[tops.length - 1]!) {
    return { index: Math.max(0, tops.length - 2), t: 1 };
  }
  return { index: 0, t: 0 };
}

export function WorldScrollCamera() {
  const { camera, invalidate } = useThree();
  const setFocusRoom = useWorldStore((s) => s.setFocusRoom);
  const lastSection = useRef(0);

  useEffect(() => {
    const onScroll = () => invalidate();
    const root = getScrollRoot();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if (isElementScrollRoot(root)) root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (isElementScrollRoot(root)) root.removeEventListener("scroll", onScroll);
    };
  }, [invalidate]);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const { index, t } = getScrollSegment();
    const fromId = CV_SCROLL_SECTION_ORDER[index]!;
    const toId = CV_SCROLL_SECTION_ORDER[Math.min(index + 1, CV_SCROLL_SECTION_ORDER.length - 1)]!;
    const pose = lerpPose(BLENDER_CV_CAMERAS[fromId], BLENDER_CV_CAMERAS[toId], t);

    cam.position.set(...pose.position);
    cam.fov = pose.fov ?? cam.fov;
    cam.updateProjectionMatrix();
    _target.set(...pose.target);
    cam.lookAt(_target);

    const activeIndex =
      t > 0.5 ? Math.min(index + 1, CV_SCROLL_SECTION_ORDER.length - 1) : index;
    if (activeIndex !== lastSection.current) {
      lastSection.current = activeIndex;
      if (useWorldStore.getState().phase !== "traveling") {
        setFocusRoom(CV_SCROLL_SECTION_ORDER[activeIndex]!);
      }
    }
  });

  return null;
}
