import type { State } from "@/types";
import { Column } from "@/components";

interface BoardProps {
  currentPlayer: State.Player;
  board: State.Board;
  isDisabled?: boolean;
  status: State.GameStatus;
  onColumnClicked: (idx: number) => void;
}

export function Board({
  currentPlayer,
  board,
  status,
  isDisabled = false,
  onColumnClicked,
}: BoardProps): React.ReactElement {
  const enabledClass = isDisabled ? "disabled" : "enabled";

  return (
    <div className={`board ${enabledClass} current-player-${currentPlayer}`}>
      {board.map((column: State.Column, idx: number) => (
        <Column
          column={column}
          onClick={(idx: number) => !isDisabled && onColumnClicked(idx)}
          columnId={idx}
          status={status}
          key={`column-${idx}`}
        />
      ))}
    </div>
  );
}
