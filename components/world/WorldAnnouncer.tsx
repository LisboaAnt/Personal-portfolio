"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useWorldStore } from "@/stores/world-store";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";
import type { RoomId } from "@/world/types";

export function WorldAnnouncer() {
  const enabled = useWorldEnabled();
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const phase = useWorldStore((s) => s.phase);
  const t = useTranslations("World");
  const [message, setMessage] = useState("");
  const prevRoom = useRef<RoomId | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (prevRoom.current === focusRoomId && phase !== "traveling") return;
    prevRoom.current = focusRoomId;
    const roomLabel = t(`rooms.${focusRoomId}`);
    setMessage(
      phase === "traveling" ? t("navigatingTo", { room: roomLabel }) : t("viewingRoom", { room: roomLabel })
    );
  }, [enabled, focusRoomId, phase, t]);

  if (!enabled) return null;

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
