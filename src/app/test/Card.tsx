"use client";

import { useEffect, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

type Props = {
  card: {
    id: string;
    title: string;
  };
};

export default function Card({ card }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    return draggable({
      element: ref.current,
      getInitialData: () => ({
        card,
      }),
    });
  }, [card]);

  return (
    <div
      ref={ref}
      className="rounded bg-white shadow p-4 cursor-grab active:cursor-grabbing"
    >
      {card.title}
    </div>
  );
}
