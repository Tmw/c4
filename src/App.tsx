import React, { useState, useCallback } from "react";
import "./app.css";

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
namespace State {
  export type Player = "red" | "yellow";
  export type Cell = "open" | Player;
  export type Column = Cell[];
  export type Board = Column[];
  export type GameState = {
    status: "playing" | "draw" | "winner-red" | "winner-yellow";
    board: Board;
    currentPlayer: Player;
  };
}

const makeColumn = (length: number = BOARD_HEIGHT): State.Column =>
  Array.from({ length }, (_v, _k) => "open");

const makeBoard = (width: number = BOARD_WIDTH): State.Board =>
  Array.from({ length: width }, (_v, _k) => makeColumn());

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
// TODO: win conditions
// TODO: unit tests (prolly easier with use reducer)

function useGameState() {
  const [state, setGameState] = useState(initialState());

  const playColumn = (columnId: number) => {
    // find column
    const column = state.board.at(columnId);
    if (column === undefined) return;

    // find open spot in column
    const openIndex = column.findLastIndex(
      (cell: State.Cell) => cell === "open"
    );
    if (openIndex < 0) return;

    const newColumn = replace(column, openIndex, state.currentPlayer);
    const newBoard = replace(state.board, columnId, newColumn);

    setGameState({
      ...state,
      currentPlayer: oppositePlayer(state.currentPlayer),
      board: newBoard,
    });
  };

  return { ...state, playColumn } as const;
}

export default function App() {
  const { currentPlayer, board, playColumn } = useGameState();

  const clickColumn = useCallback(
    (idx: number) => {
      playColumn(idx);
    },
    [board, currentPlayer, playColumn]
  );

  return (
    <div className="App">
      <p>current player: {currentPlayer}</p>
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
