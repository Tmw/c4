import React, { useState, useCallback } from "react";
import type { State } from "./types";
import { makeBoard, checkBoardState, putCell } from "./board-utils";

import "./app.css";

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

const initialState = (): State.GameState => {
  return {
    status: "playing",
    currentPlayer: "yellow",
    board: makeBoard(),
  };
};

const oppositePlayer = (player: State.Player): State.Player =>
  player === "red" ? "yellow" : "red";

const replace = <T,>(list: T[], idx: number, newVal: T): T[] => {
  return [...list.slice(0, idx), newVal, ...list.slice(idx + 1)];
};

// Note: Might want to switch to UseReducer instead
// TODO: unit tests (prolly easier with use reducer)
function useGameState() {
  const [state, setGameState] = useState(initialState());

  const playColumn = (columnId: number) => {
    const newBoard = putCell(state.board, columnId, state.currentPlayer);

    setGameState({
      ...state,
      currentPlayer: oppositePlayer(state.currentPlayer),
      board: newBoard,
      status: checkBoardState(newBoard),
    });
  };

  return { ...state, playColumn } as const;
}

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
