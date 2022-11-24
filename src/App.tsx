import React, { useState, useCallback, startTransition } from "react";
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

const checkCells = (cells: State.Cell[]): State.Player | "none" => {
  let dupCount = 0;

  for (let i = 1; i < cells.length; i++) {
    // if cell is not open and new cell is equal to previous cell we increase the dupCounter.
    // only if we have seen 3 or more duplicates (meaning four or more of the same cells)
    // we assume a winner.
    if (cells[i] !== "open" && cells[i] === cells[i - 1]) {
      dupCount++;

      if (dupCount >= 3) {
        // Note: Perhaps Satisfies would be helpful here?
        return cells[i] as State.Player;
      }

      continue;
    }
  }

  return "none";
};

const getVerticals = (board: State.Board): State.Cell[][] => board;

const getHorizontals = (board: State.Board): State.Cell[][] => {
  const columnLength = board[0].length;
  const out: Array<State.Cell[]> = [];

  for (let row = 0; row < columnLength; row++) {
    const sequence: Array<State.Cell> = [];
    for (let col = 0; col < board.length; col++) {
      sequence.push(board[col][row]);
    }

    out.push(sequence);
  }

  return out;
};

// NOTE: Have these unit tested and then refactor
const getDiagonalsTopToBottom = (board: State.Board): State.Cell[][] => {
  const columnLength = board[0].length;
  const rowLength = board.length;
  const out: Array<Array<State.Cell>> = [];

  let startCol = 0;
  let startRow = columnLength - 1;

  while (startCol < rowLength || startRow > 0) {
    const diagonal: Array<State.Cell> = [];

    // NOTE: Pretty sure this can just be a for-loop tho
    let col = startCol;
    let row = startRow;

    while (col <= rowLength && row <= columnLength) {
      const cell = board.at(col)?.at(row);
      if (cell) diagonal.push(cell);

      col++;
      row++;
    }

    if (diagonal.length >= 4) {
      out.push(diagonal);
    }

    if (startRow <= 0) {
      startCol++;
    } else {
      startRow--;
    }
  }

  return out;
};

const getDiagonalsBottomToTop = (board: State.Board): State.Cell[][] => {
  const columnLength = board[0].length;
  const rowLength = board.length;
  const out: Array<Array<State.Cell>> = [];

  let startCol = rowLength - 1;
  let startRow = columnLength - 1;

  while (startCol > 0 || startRow > 0) {
    const diagonal: Array<State.Cell> = [];

    // NOTE: Pretty sure this can just be a for-loop tho
    let col = startCol;
    let row = startRow;

    while (col >= 0 && row <= rowLength) {
      const cell = board.at(col)?.at(row);
      if (cell) diagonal.push(cell);

      col--;
      row++;
    }

    if (diagonal.length) {
      out.push(diagonal);
    }

    if (startRow <= 0) {
      startCol--;
    } else {
      startRow--;
    }
  }

  return out;
};

const checkBoardState = (board: State.Board): State.GameState["status"] => {
  const sequelsToCheck = [
    ...getVerticals(board),
    ...getHorizontals(board),
    ...getDiagonalsTopToBottom(board),
    ...getDiagonalsBottomToTop(board),
  ];

  for (let cells of sequelsToCheck) {
    const result = checkCells(cells);
    if (result !== "none") {
      return `winner-${result}`;
    }
  }

  return "playing";
};

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
