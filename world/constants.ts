/** Duração do crossfade do overlay ao sair (ms) */
export const WORLD_OVERLAY_FADE_OUT_MS = 220;

/** Duração do crossfade do overlay ao entrar (ms) */
export const WORLD_OVERLAY_FADE_IN_MS = 380;

/** Atraso antes do fade-in após mudança de rota (ms) */
export const WORLD_OVERLAY_ENTER_DELAY_MS = 700;

/** Duração da animação da câmara (s) — navegação por link / ilha */
export const WORLD_CAMERA_DURATION_S = 1.15;

/** Transição hero ↔ experience no mundo Blender (s). */
export const WORLD_SECTION_CAMERA_DURATION_S = 1.85;

/** Troca de job dentro de Experience (s). */
export const WORLD_EXPERIENCE_JOB_CAMERA_DURATION_S = 1.1;

/** Troca de etapa dentro da mesma experiência (s). */
export const WORLD_EXPERIENCE_STAGE_CAMERA_DURATION_S = 0.95;

/** Blur máximo (px) no canvas durante viagem da câmara. */
export const WORLD_CAMERA_TRAVEL_BLUR_MAX_PX = 4.5;

/** Duração da animação da câmara ao mudar de secção com scroll */
export const WORLD_SCROLL_CAMERA_DURATION_S = 1.35;

/** Duração da câmara com prefers-reduced-motion */
export const WORLD_REDUCED_CAMERA_DURATION_S = 0.12;

/** Plano far da câmara (distância máxima de visão) — cena Blender */
export const WORLD_CAMERA_FAR_BLENDER = 12000;

/** Plano far da câmara — mundo em código (ilhas pequenas) */
export const WORLD_CAMERA_FAR_CODE = 80;

/** Velocidade WASD (unidades/s) — cena Blender */
export const WORLD_WASD_MOVE_SPEED = 110;

/** Multiplicador de velocidade da câmara livre (1 = 100%). */
export const WORLD_CAMERA_MOVE_SPEED_DEFAULT = 1;
export const WORLD_CAMERA_MOVE_SPEED_MIN = 0.25;
export const WORLD_CAMERA_MOVE_SPEED_MAX = 3;
export const WORLD_CAMERA_MOVE_SPEED_STEP = 0.1;
export const WORLD_CAMERA_MOVE_SPEED_STORAGE_KEY = "portfolio-camera-move-speed";

/** Câmara livre (WASD / Shift) — só quando activada no HUD. */
export const WORLD_FREE_CAMERA_STORAGE_KEY = "portfolio-free-camera-enabled";
