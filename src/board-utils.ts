import type { State } from "./types";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";

export const getVerticals = (board: State.Board): State.Cell[][] => board;

export const getHorizontals = (board: State.Board): State.Cell[][] => {
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

export const getDiagonalsTopToBottom = (board: State.Board): State.Cell[][] => {
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

export const getDiagonalsBottomToTop = (board: State.Board): State.Cell[][] => {
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

export const checkBoardState = (
  board: State.Board
): State.GameState["status"] => {
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

export const putCell = (
  board: State.Board,
  columnIndex: number,
  player: State.Player
): State.Board => {
  // find column
  const column = board.at(columnIndex);
  if (column === undefined) {
    return board;
  }

  // find open spot in column
  const openIndex = column.findLastIndex((cell: State.Cell) => cell === "open");
  if (openIndex < 0) {
    return board;
  }

  const newColumn = replace(column, openIndex, player);
  return replace(board, columnIndex, newColumn);
};

const replace = <T>(list: T[], idx: number, newVal: T): T[] => {
  return [...list.slice(0, idx), newVal, ...list.slice(idx + 1)];
};

const makeColumn = (length: number): State.Column =>
  Array.from({ length }, (_v, _k) => "open");

export const makeBoard = (
  width: number = BOARD_WIDTH,
  height: number = BOARD_HEIGHT
): State.Board => Array.from({ length: width }, (_v, _k) => makeColumn(height));
