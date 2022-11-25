import React, { useCallback } from "react";
import type { State } from "@/types";
import { useGameState } from "@/hooks/useGameState";

import "@/assets/css/app.css";

interface CellProps {
  cell: State.Cell;
}

const Cell: React.FC<CellProps> = (props: CellProps) => {
  return <div className={`cell cell-state-${props.cell}`}></div>;
};

interface ColumnProps {
  columnId: number;
  column: State.Column;
  onClick: (idx: number) => void;
}

const Column: React.FC<ColumnProps> = (props: ColumnProps) => {
  return (
    <div className="column" onClick={() => props.onClick(props.columnId)}>
      {props.column.map((cell: State.Cell, idx: number) => (
        <Cell cell={cell} key={`cell-${idx}`} />
      ))}
    </div>
  );
};

export default function App() {
  const { currentPlayer, board, status, playColumn } = useGameState();

  const clickColumn = useCallback(
    (idx: number) => {
      playColumn(idx);
    },
    [board, currentPlayer, playColumn]
  );

  return (
    <div className="App">
      <p>
        current player: {currentPlayer} | game state: {status}
      </p>
      <div className={`board current-player-${currentPlayer}`}>
        {board.map((column: State.Column, idx: number) => (
          <Column
            column={column}
            onClick={clickColumn}
            columnId={idx}
            key={`column-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
