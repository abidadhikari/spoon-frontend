"use client";

import { useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import Card from "./Card";
import { ColumnType } from "./Board";

type Props = {
  column: ColumnType;
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

export default function Column({ column, columns, setColumns }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    return dropTargetForElements({
      element: ref.current,
      getData: () => ({
        columnId: column.id,
      }),
      onDrop({ source }) {
        const card = source.data.card;

        if (!card) return;

        const sourceColumn = columns.find((c) =>
          c.cards.some((x) => x.id === card.id),
        );

        if (!sourceColumn) return;

        setColumns((prev) => {
          const copy = structuredClone(prev);

          const from = copy.find((c) => c.id === sourceColumn.id)!;
          const to = copy.find((c) => c.id === column.id)!;

          from.cards = from.cards.filter((c) => c.id !== card.id);
          to.cards.push(card);

          return copy;
        });
      },
    });
  }, [column.id, columns]);

  return (
    <div ref={ref} className="w-72 rounded bg-gray-100 p-4 min-h-[400px]">
      <h2 className="mb-4 font-bold">{column.title}</h2>

      <div className="space-y-3">
        {column.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
