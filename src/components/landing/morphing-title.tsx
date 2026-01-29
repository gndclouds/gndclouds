"use client";

import { useEffect, useState } from "react";

/** Per-character delay (ms) when "deleting" (backspace style). */
const DELETE_CHAR_MS = 22;
/** Per-character delay (ms) when typing. */
const TYPE_CHAR_MS = 28;
/** Pause between delete and type (ms). */
const PAUSE_BETWEEN_MS = 100;

/** Total duration for typewriter: delete + pause + type (used by parent for clearing isMorphing). */
export function getTypewriterDuration(prevLen: number, nextLen: number): number {
  return prevLen * DELETE_CHAR_MS + PAUSE_BETWEEN_MS + nextLen * TYPE_CHAR_MS;
}

export const MORPH_DURATION_MS = 600; // fallback if parent doesn't use getTypewriterDuration

interface MorphingTitleProps {
  /** Previous tab's title (same slot index). */
  prevText: string;
  /** Current tab's title. */
  nextText: string;
  /** When true, we're in typewriter state (tab just changed). */
  isMorphing: boolean;
  className?: string;
}

type Phase = "idle" | "deleting" | "pause" | "typing";

export function MorphingTitle({ prevText, nextText, isMorphing, className }: MorphingTitleProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayText, setDisplayText] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!isMorphing) {
      setPhase("idle");
      setDisplayText(nextText);
      setVisibleCount(nextText.length);
      return;
    }

    if (prevText === nextText) {
      setPhase("idle");
      setDisplayText(nextText);
      setVisibleCount(nextText.length);
      return;
    }

    setDisplayText(prevText);
    setVisibleCount(prevText.length);
    setPhase("deleting");
  }, [prevText, nextText, isMorphing]);

  // Deleting: backspace one char at a time
  useEffect(() => {
    if (phase !== "deleting") return;
    if (visibleCount <= 0) {
      setPhase("pause");
      return;
    }
    const t = setTimeout(() => setVisibleCount((c) => c - 1), DELETE_CHAR_MS);
    return () => clearTimeout(t);
  }, [phase, visibleCount]);

  // Pause then switch to typing
  useEffect(() => {
    if (phase !== "pause") return;
    const t = setTimeout(() => {
      setDisplayText(nextText);
      setVisibleCount(0);
      setPhase("typing");
    }, PAUSE_BETWEEN_MS);
    return () => clearTimeout(t);
  }, [phase, nextText]);

  // Typing: type one char at a time
  useEffect(() => {
    if (phase !== "typing") return;
    if (visibleCount >= nextText.length) {
      setPhase("idle");
      return;
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), TYPE_CHAR_MS);
    return () => clearTimeout(t);
  }, [phase, visibleCount, nextText.length]);

  const visible = displayText.slice(0, visibleCount);
  const cursor = phase === "typing" && visibleCount < nextText.length;

  return (
    <span
      className={
        className ? `typewriter-title inline truncate ${className}` : "typewriter-title inline truncate"
      }
    >
      {visible}
      {cursor ? <span className="typewriter-cursor shrink-0" aria-hidden /> : null}
    </span>
  );
}
