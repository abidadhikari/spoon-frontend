import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";

type Identifiable = { id: string };

export function reorderByClosestEdge<T extends Identifiable>({
  list,
  sourceId,
  targetId,
  closestEdge,
}: {
  list: T[];
  sourceId: string;
  targetId: string;
  closestEdge: Edge | null;
}): T[] {
  const startIndex = list.findIndex((item) => item.id === sourceId);
  const targetIndex = list.findIndex((item) => item.id === targetId);

  if (startIndex === -1 || targetIndex === -1) {
    return list;
  }

  let finishIndex = targetIndex;

  if (closestEdge === "bottom") {
    finishIndex = targetIndex + 1;
  }

  // Adjust because removing the source shifts later indices
  if (startIndex < finishIndex) {
    finishIndex--;
  }

  if (startIndex === finishIndex) {
    return list;
  }

  return reorder({
    list,
    startIndex,
    finishIndex,
  });
}
