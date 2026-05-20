"use client";

import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { useWorldNavigate, type WorldHref } from "@/hooks/useWorldNavigate";

type Props = ComponentProps<typeof Link>;

export function WorldLink({ href, onClick, ...rest }: Props) {
  const { navigate, enabled } = useWorldNavigate();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !enabled) return;
        e.preventDefault();
        navigate(href as WorldHref);
      }}
      {...rest}
    />
  );
}
