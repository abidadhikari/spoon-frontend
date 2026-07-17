"use client";

import { useState } from "react";
import Column from "./Column";

export type CardType = {
  id: string;
  title: string;
};

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

export default function Board() {
  const [columns, setColumns] = useState<ColumnType[]>([
    {
      id: "todo",
      title: "Todo",
      cards: [
        { id: "1", title: "Task 1" },
        { id: "2", title: "Task 2" },
      ],
    },
    {
      id: "doing",
      title: "Doing",
      cards: [{ id: "3", title: "Task 3" }],
    },
    {
      id: "done",
      title: "Done",
      cards: [],
    },
  ]);

  return (
    <div className="flex gap-6">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          columns={columns}
          setColumns={setColumns}
        />
      ))}
    </div>
  );
}
