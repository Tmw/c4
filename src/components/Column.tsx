import { State } from "@/types";
import { Cell } from "@/components";

interface ColumnProps {
  columnId: number;
  column: State.Column;
  status: State.GameStatus;
  onClick: (idx: number) => void;
}

function getCellIdentifier(colId: number, cellId: number): string {
  return `${colId}x${cellId}`;
}

export function Column(props: ColumnProps) {
  const shouldHighlight = (cellId: number): boolean => {
    // if there's no winner, we wont highlight anything.
    if (props.status.status !== "winner") {
      return false;
    }

    const { winningCells } = props.status;
    const winningIdentifiers = winningCells.map((cell) => cell.identifier);
    const cellIdentifier = getCellIdentifier(props.columnId, cellId);
    return winningIdentifiers.includes(cellIdentifier);
  };

  return (
    <div className="column" onClick={() => props.onClick(props.columnId)}>
      {props.column.map((cell: State.Cell, idx: number) => {
        const highlighted = shouldHighlight(idx);

        return (
          <Cell cell={cell} key={`cell-${idx}`} highlighted={highlighted} />
        );
      })}
    </div>
  );
}
