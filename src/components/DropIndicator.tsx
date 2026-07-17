import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

type DropIndicatorProps = {
  edge: Edge | null;
};

export default function DropIndicator({ edge }: DropIndicatorProps) {
  if (edge !== "top" && edge !== "bottom") return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-0 left-0 z-10 h-0.5 bg-blue-600 ${
        edge === "top" ? "-top-1" : "-bottom-1"
      }`}
    >
      <span className="absolute -top-1.5 -left-1 h-3 w-3 rounded-full bg-blue-600" />
    </div>
  );
}
