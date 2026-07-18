"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SkillTileIcon } from "@/components/home/skillTileIcon";

export type ProjectMetroItem = {
  id: string;
  label: string;
  href?: string;
};

export type ProjectMetroGroup = {
  id: string;
  label: string;
  items: ProjectMetroItem[];
};

const METRO_TILE_COLORS = [
  "#6b9e1f",
  "#2b579a",
  "#da3b01",
  "#008272",
  "#b4009e",
  "#e74856",
  "#0099bc",
  "#7a7574",
  "#881798",
  "#107c10",
  "#ff8c00",
  "#038387",
] as const;

const CATEGORY_COLORS_BY_ID: Record<string, string> = {
  youtube: "#e74856",
  github: "#2b579a",
  work: "#008272",
};

const CATEGORY_MEDIA: Record<
  string,
  { kind: "icon" | "stack"; src?: string; front?: string; back?: string }
> = {
  youtube: {
    kind: "icon",
    src: "/projects/youtubechanelprint.png",
  },
  github: {
    kind: "icon",
    src: "/projects/githubprintprofile.png",
  },
  work: {
    kind: "stack",
    front: "/projects/vittahubicon.png",
    back: "/projects/alemsysicon.png",
  },
};

const ITEM_ICONS: Record<string, string> = {
  vittahub: "/projects/vittahubicon.png",
  alemsys: "/projects/alemsysicon.png",
  "yt-opengl": "/youtube/openglplaylistprint.png",
  "yt-big-calendar": "/youtube/reactbigcalendarpleylist.png",
};

const ITEM_ICON_RECT = new Set(["yt-opengl", "yt-big-calendar"]);
const ITEM_WIDE = new Set(["yt-opengl", "yt-big-calendar"]);

const DRAG_THRESHOLD_PX = 5;

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function tileColor(key: string): string {
  return METRO_TILE_COLORS[hashKey(key) % METRO_TILE_COLORS.length]!;
}

function categoryColor(id: string, fallbackIndex: number): string {
  return (
    CATEGORY_COLORS_BY_ID[id] ??
    METRO_TILE_COLORS[fallbackIndex % METRO_TILE_COLORS.length]!
  );
}

function reorderList<T>(list: T[], fromId: T, toId: T): T[] {
  const from = list.indexOf(fromId);
  const to = list.indexOf(toId);
  if (from < 0 || to < 0 || from === to) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved!);
  return next;
}

type DragKind = "category" | "item";

type DragSession = {
  pointerId: number;
  key: string;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  label: string;
  color: string;
  count?: number;
  wide?: boolean;
  iconSrc?: string;
  iconRect?: boolean;
  moved: boolean;
  kind: DragKind;
};

type GhostPaint = {
  kind: DragKind;
  key: string;
  label: string;
  color: string;
  count?: number;
  wide?: boolean;
  iconSrc?: string;
  iconRect?: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
};

type Props = {
  groups: ProjectMetroGroup[];
};

export function ProjectsMetro({ groups }: Props) {
  const t = useTranslations("Home.projects");
  const router = useRouter();
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const [categoryOrder, setCategoryOrder] = useState(() => groups.map((g) => g.id));
  const [itemOrders, setItemOrders] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.items.map((i) => i.id)])),
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pressingId, setPressingId] = useState<string | null>(null);
  const [ghost, setGhost] = useState<GhostPaint | null>(null);
  const [mounted, setMounted] = useState(false);
  const dragRef = useRef<DragSession | null>(null);
  const ghostElRef = useRef<HTMLDivElement | null>(null);
  const openIdRef = useRef<string | null>(null);
  const itemByIdRef = useRef<Record<string, ProjectMetroItem>>({});
  const listeningRef = useRef(false);
  openIdRef.current = openId;

  useEffect(() => {
    setMounted(true);
  }, []);

  const groupsKey = groups
    .map((g) => `${g.id}:${g.label}:${g.items.map((i) => i.id).join("\u001f")}`)
    .join("|");

  useEffect(() => {
    setCategoryOrder(groups.map((g) => g.id));
    setItemOrders(Object.fromEntries(groups.map((g) => [g.id, g.items.map((i) => i.id)])));
    setOpenId(null);
  }, [groupsKey, groups]);

  useEffect(() => {
    if (!draggingId) return;
    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
    };
  }, [draggingId]);

  const groupById = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.id, g])) as Record<string, ProjectMetroGroup>,
    [groups],
  );

  const itemById = useMemo(() => {
    const map: Record<string, ProjectMetroItem> = {};
    for (const g of groups) {
      for (const item of g.items) map[item.id] = item;
    }
    return map;
  }, [groups]);
  itemByIdRef.current = itemById;

  const orderedCategories = useMemo(
    () => categoryOrder.map((id) => groupById[id]).filter(Boolean) as ProjectMetroGroup[],
    [categoryOrder, groupById],
  );

  const openGroup = openId ? groupById[openId] : null;
  const openItemIds = openId ? (itemOrders[openId] ?? openGroup?.items.map((i) => i.id) ?? []) : [];
  const openItems = openItemIds.map((id) => itemById[id]).filter(Boolean) as ProjectMetroItem[];

  const routerRef = useRef(router);
  routerRef.current = router;

  const apiRef = useRef({
    syncGhost(x: number, y: number) {
      const el = ghostElRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.08) rotate(-1.5deg)`;
    },
    beginFloating(session: DragSession, clientX: number, clientY: number) {
      if (session.moved) return;
      session.moved = true;
      const x = clientX - session.offsetX;
      const y = clientY - session.offsetY;
      setPressingId(null);
      setDraggingId(session.key);
      setGhost({
        kind: session.kind,
        key: session.key,
        label: session.label,
        color: session.color,
        count: session.count,
        wide: session.wide,
        iconSrc: session.iconSrc,
        iconRect: session.iconRect,
        width: session.width,
        height: session.height,
        x,
        y,
      });
    },
    finish(clientX: number, clientY: number) {
      const session = dragRef.current;
      apiRef.current.stopListening();
      dragRef.current = null;
      setDraggingId(null);
      setPressingId(null);
      setGhost(null);
      if (!session) return;

      if (!session.moved) {
        if (session.kind === "category") setOpenId(session.key);
        else if (session.kind === "item") {
          const href = itemByIdRef.current[session.key]?.href;
          if (!href) return;
          if (href.startsWith("/work")) {
            routerRef.current.push(href);
          } else if (href.startsWith("http")) {
            window.open(href, "_blank", "noopener,noreferrer");
          }
        }
        return;
      }

      const el = document.elementFromPoint(clientX, clientY);
      if (session.kind === "category") {
        const target = el?.closest<HTMLElement>("[data-project-cat]");
        const toId = target?.dataset.projectCat;
        if (toId && toId !== session.key) {
          setCategoryOrder((prev) => reorderList(prev, session.key, toId));
        }
        return;
      }

      const groupId = openIdRef.current;
      if (!groupId) return;
      const target = el?.closest<HTMLElement>("[data-project-item]");
      const toId = target?.dataset.projectItem;
      if (toId && toId !== session.key) {
        setItemOrders((prev) => ({
          ...prev,
          [groupId]: reorderList(prev[groupId] ?? [], session.key, toId),
        }));
      }
    },
    cancel() {
      apiRef.current.stopListening();
      dragRef.current = null;
      setDraggingId(null);
      setPressingId(null);
      setGhost(null);
    },
    onMove(e: PointerEvent) {
      const session = dragRef.current;
      if (!session || session.pointerId !== e.pointerId) return;
      session.lastX = e.clientX;
      session.lastY = e.clientY;

      if (!session.moved) {
        const dist = Math.hypot(e.clientX - session.startX, e.clientY - session.startY);
        if (dist < DRAG_THRESHOLD_PX) return;
        apiRef.current.beginFloating(session, e.clientX, e.clientY);
        return;
      }

      apiRef.current.syncGhost(e.clientX - session.offsetX, e.clientY - session.offsetY);
    },
    onUp(e: PointerEvent) {
      const session = dragRef.current;
      if (!session || session.pointerId !== e.pointerId) return;
      apiRef.current.finish(e.clientX, e.clientY);
    },
    onCancel(e: PointerEvent) {
      const session = dragRef.current;
      if (!session || session.pointerId !== e.pointerId) return;
      apiRef.current.cancel();
    },
    stopListening() {
      if (!listeningRef.current) return;
      listeningRef.current = false;
      window.removeEventListener("pointermove", stableMove);
      window.removeEventListener("pointerup", stableUp);
      window.removeEventListener("pointercancel", stableCancel);
    },
    startListening() {
      if (listeningRef.current) return;
      listeningRef.current = true;
      window.addEventListener("pointermove", stableMove);
      window.addEventListener("pointerup", stableUp);
      window.addEventListener("pointercancel", stableCancel);
    },
  });

  function stableMove(e: PointerEvent) {
    apiRef.current.onMove(e);
  }
  function stableUp(e: PointerEvent) {
    apiRef.current.onUp(e);
  }
  function stableCancel(e: PointerEvent) {
    apiRef.current.onCancel(e);
  }

  useEffect(() => () => apiRef.current.stopListening(), []);

  function onTilePointerDown(
    e: ReactPointerEvent<HTMLElement>,
    meta: {
      key: string;
      kind: DragKind;
      label: string;
      color: string;
      count?: number;
      wide?: boolean;
      iconSrc?: string;
      iconRect?: boolean;
    },
  ) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: e.pointerId,
      key: meta.key,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      label: meta.label,
      color: meta.color,
      count: meta.count,
      wide: meta.wide,
      iconSrc: meta.iconSrc,
      iconRect: meta.iconRect,
      moved: false,
      kind: meta.kind,
    };
    setPressingId(meta.key);
    apiRef.current.startListening();
  }

  const ghostNode =
    mounted && ghost
      ? createPortal(
          <div
            ref={(node) => {
              ghostElRef.current = node;
              if (node) {
                const session = dragRef.current;
                const x = session ? session.lastX - session.offsetX : ghost.x;
                const y = session ? session.lastY - session.offsetY : ghost.y;
                node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.08) rotate(-1.5deg)`;
              }
            }}
            className="skills-metro__ghost"
            style={{ width: ghost.width, height: ghost.height }}
            aria-hidden
          >
            <div
              className={[
                "skills-metro__tile skills-metro__ghost-tile",
                ghost.kind === "category"
                  ? "skills-metro__tile--category"
                  : "skills-metro__tile--item",
                ghost.wide ? "skills-metro__tile--wide" : "",
                ghost.iconRect ? "projects-metro__tile--print" : "",
              ].join(" ")}
              style={{ backgroundColor: ghost.color, width: "100%", height: "100%" }}
            >
              {ghost.kind === "item" ? (
                ghost.iconSrc ? (
                  <span
                    className={[
                      "projects-metro__item-icon",
                      ghost.iconRect ? "projects-metro__item-icon--rect" : "",
                    ].join(" ")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ghost.iconSrc} alt="" />
                  </span>
                ) : (
                  <SkillTileIcon label={ghost.label} className="skills-metro__tile-icon" />
                )
              ) : (
                <span className="skills-metro__tile-count" aria-hidden>
                  {ghost.count}
                </span>
              )}
              <span
                className={[
                  "skills-metro__tile-label",
                  ghost.kind === "category" ? "skills-metro__tile-label--category" : "",
                ].join(" ")}
              >
                {ghost.label}
              </span>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={["skills-metro projects-metro", draggingId ? "is-reordering" : ""].join(" ")}>
      {ghostNode}
      <AnimatePresence mode="wait">
        {openGroup ? (
          <motion.div
            key={`detail-${openGroup.id}`}
            className="skills-metro__detail"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="skills-metro__detail-bar">
              <button
                type="button"
                className="skills-metro__back site-chip-btn"
                onClick={() => setOpenId(null)}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-3.5 w-3.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.5 5 7.5 10l5 5" />
                </svg>
                <span>{t("back")}</span>
              </button>
              <h3 className="skills-metro__heading skills-metro__heading--inline">
                {openGroup.label}
              </h3>
            </div>

            <ul className="skills-metro__grid skills-metro__grid--items">
              {openItems.map((item, i) => (
                <li
                  key={item.id}
                  data-project-item={item.id}
                  className={[
                    "skills-metro__tile-wrap",
                    ITEM_WIDE.has(item.id) ? "skills-metro__tile-wrap--wide projects-metro__tile-wrap--print" : "",
                    pressingId === item.id ? "is-pressing" : "",
                    draggingId === item.id ? "is-dragging" : "",
                    item.href ? "has-link" : "",
                  ].join(" ")}
                  onPointerDown={(e) =>
                    onTilePointerDown(e, {
                      key: item.id,
                      kind: "item",
                      label: item.label,
                      color: tileColor(item.id),
                      wide: ITEM_WIDE.has(item.id),
                      iconSrc: ITEM_ICONS[item.id],
                      iconRect: ITEM_ICON_RECT.has(item.id),
                    })
                  }
                >
                  <motion.div
                    className={[
                      "skills-metro__tile skills-metro__tile--item",
                      ITEM_WIDE.has(item.id) ? "skills-metro__tile--wide" : "",
                      ITEM_ICON_RECT.has(item.id) ? "projects-metro__tile--print" : "",
                    ].join(" ")}
                    style={{ backgroundColor: tileColor(item.id) }}
                    initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.24,
                      delay: reduced ? 0 : i * 0.025,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    {ITEM_ICONS[item.id] ? (
                      <span
                        className={[
                          "projects-metro__item-icon",
                          ITEM_ICON_RECT.has(item.id) ? "projects-metro__item-icon--rect" : "",
                        ].join(" ")}
                      >
                        <Image
                          src={ITEM_ICONS[item.id]!}
                          alt=""
                          width={ITEM_ICON_RECT.has(item.id) ? 160 : 40}
                          height={ITEM_ICON_RECT.has(item.id) ? 100 : 40}
                        />
                      </span>
                    ) : (
                      <SkillTileIcon label={item.label} className="skills-metro__tile-icon" />
                    )}
                    <span className="skills-metro__tile-label">{item.label}</span>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key="categories"
            className="skills-metro__categories"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="skills-metro__grid skills-metro__grid--categories skills-metro__grid--projects-cats">
              {orderedCategories.map((g, i) => {
                const color = categoryColor(g.id, i);
                return (
                  <li
                    key={g.id}
                    data-project-cat={g.id}
                    className={[
                      "skills-metro__tile-wrap",
                      pressingId === g.id ? "is-pressing" : "",
                      draggingId === g.id ? "is-dragging" : "",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      className="skills-metro__tile skills-metro__tile--category projects-metro__cat"
                      style={{ backgroundColor: color }}
                      tabIndex={0}
                      onPointerDown={(e) =>
                        onTilePointerDown(e, {
                          key: g.id,
                          kind: "category",
                          label: g.label,
                          color,
                          count: g.items.length,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenId(g.id);
                        }
                      }}
                      aria-label={`${g.label} — ${g.items.length}`}
                    >
                      {CATEGORY_MEDIA[g.id]?.kind === "icon" && CATEGORY_MEDIA[g.id]?.src ? (
                        <span className="projects-metro__mid-icon" aria-hidden>
                          <Image
                            src={CATEGORY_MEDIA[g.id]!.src!}
                            alt=""
                            width={88}
                            height={60}
                          />
                        </span>
                      ) : null}
                      {CATEGORY_MEDIA[g.id]?.kind === "stack" ? (
                        <span className="projects-metro__icon-stack" aria-hidden>
                          <span className="projects-metro__icon-stack-back">
                            <Image
                              src={CATEGORY_MEDIA[g.id]!.back!}
                              alt=""
                              width={64}
                              height={64}
                            />
                          </span>
                          <span className="projects-metro__icon-stack-front">
                            <Image
                              src={CATEGORY_MEDIA[g.id]!.front!}
                              alt=""
                              width={68}
                              height={68}
                            />
                          </span>
                        </span>
                      ) : null}
                      <span className="skills-metro__tile-count" aria-hidden>
                        {g.items.length}
                      </span>
                      <span className="skills-metro__tile-label skills-metro__tile-label--category">
                        {g.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
