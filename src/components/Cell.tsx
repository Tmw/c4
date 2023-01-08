import { State } from "@/types";

interface CellProps {
  cell: State.Cell;
  highlighted?: boolean;
}

export function Cell({ cell, highlighted }: CellProps) {
  return (
    <div
      className={`cell cell-state-${cell.status} ${
        highlighted ? "cell-highlighted" : ""
      }`}
    />
  );
}
