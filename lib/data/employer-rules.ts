import type { ApplicationStage } from "@/lib/status";

/** The forward pipeline. Rejected sits outside it and can be reached from any open stage. */
export const PIPELINE: ApplicationStage[] = ["new", "shortlisted", "interview", "offered", "hired"];

export const NEXT_ACTION: Partial<Record<ApplicationStage, string>> = {
  new: "Shortlist",
  shortlisted: "Move to interview",
  interview: "Make offer",
  offered: "Mark as hired",
};

export function nextStage(s: ApplicationStage): ApplicationStage | null {
  const i = PIPELINE.indexOf(s);
  return i >= 0 && i < PIPELINE.length - 1 ? PIPELINE[i + 1]! : null;
}

export function prevStage(s: ApplicationStage): ApplicationStage | null {
  const i = PIPELINE.indexOf(s);
  return i > 0 ? PIPELINE[i - 1]! : null;
}

/**
 * Valid moves: one step forward, one step back (to undo a slip), Reject from any open stage
 * (Hired is final), and Reconsider (Rejected → any open stage, so a rejection can be undone).
 */
export function canMove(from: ApplicationStage, to: ApplicationStage): boolean {
  if (from === to) return false;
  if (to === "rejected") return from !== "hired";
  if (from === "rejected") return to !== "hired";
  return to === nextStage(from) || to === prevStage(from);
}
