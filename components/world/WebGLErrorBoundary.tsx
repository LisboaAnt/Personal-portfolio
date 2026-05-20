"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { WORLD_STORAGE_OFF, WORLD_STORAGE_ON } from "@/world/world-preference";

type Props = { children: ReactNode; fallback: ReactNode };

type State = { hasError: boolean };

export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[world-3d] WebGL error, falling back to 2D:", error, info.componentStack);
    }
    try {
      sessionStorage.removeItem(WORLD_STORAGE_ON);
      sessionStorage.setItem(WORLD_STORAGE_OFF, "1");
    } catch {
      /* ignore */
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
