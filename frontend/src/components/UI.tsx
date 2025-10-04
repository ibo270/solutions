// src/components/ui.tsx
import React from "react";

/* ===================== Card ===================== */
export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-2xl border border-black/10 bg-white shadow-sm " +
        "dark:border-white/10 dark:bg-white/5 " +
        className
      }
      {...props}
    />
  );
}

/* ==================== Button ==================== */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed " +
    "dark:focus:ring-offset-slate-900";

  const sizes =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
      ? "px-5 py-3 text-base"
      : "px-4 py-2 text-sm";

  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400"
      : variant === "outline"
      ? "border border-black/10 text-slate-900 hover:bg-black/5 focus:ring-slate-300 " +
        "dark:border-white/20 dark:text-white dark:hover:bg-white/10"
      : // ghost
        "bg-transparent text-slate-900 hover:bg-black/5 focus:ring-slate-300 " +
        "dark:text-white dark:hover:bg-white/10";

  return <button className={`${base} ${sizes} ${styles} ${className}`} {...props} />;
}

/* ===================== Input ==================== */
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  left?: React.ReactNode; // иконка слева
};

export function Input({ className = "", left, ...props }: InputProps) {
  return (
    <div className="relative">
      {left && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {left}
        </div>
      )}
      <input
        className={
          "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-slate-900 " +
          "placeholder:text-slate-400 shadow-sm outline-none " +
          "focus:border-blue-400 focus:ring-2 focus:ring-blue-200 " +
          "dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 " +
          (left ? "pl-9 " : "") +
          className
        }
        {...props}
      />
    </div>
  );
}

/* ===================== Badge ==================== */
export function Badge({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-xs text-slate-700 " +
        "dark:border-white/20 dark:bg-white/10 dark:text-white/80 " +
        className
      }
      {...props}
    />
  );
}

/* ===================== FadeIn ==================== */
/** Простой аниматор появления (без framer) */
export function FadeIn({
  children,
  className = "",
  duration = 400, // ms
  delay = 0, // ms
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const style: React.CSSProperties = {
    animation: `ui_fadeIn ${duration}ms ease-out ${delay}ms both`,
  };

  return (
    <>
      <style>{`
        @keyframes ui_fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={style} className={className}>
        {children}
      </div>
    </>
  );
}
