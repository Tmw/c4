import type { State } from "@/types/index";
import { BOARD_HEIGHT, BOARD_WIDTH } from "@/config/constants";

const getVerticals = (board: State.Board): State.Cell[][] => board;
const getHorizontals = (board: State.Board): State.Cell[][] => {
  const columnLength = board[0].length;
  const out = [];

  for (let row = 0; row < columnLength; row++) {
    const sequence = [];
    for (let col = 0; col < board.length; col++) {
      sequence.push(board[col][row]);
    }

    out.push(sequence);
  }

  return out;
};

const getDiagonalsTopToBottom = (board: State.Board): State.Cell[][] => {
  const columnLength = board[0].length;
  const rowLength = board.length;
  const out: Array<Array<State.Cell>> = [];

  let startCol = 0;
  let startRow = columnLength - 1;

  while (startCol < rowLength || startRow > 0) {
    const diagonal: Array<State.Cell> = [];

    for (
      let col = startCol, row = startRow;
      col <= rowLength && row <= columnLength;
      col++, row++
    ) {
      const cell = board.at(col)?.at(row);
      if (cell) {
        diagonal.push(cell);
      }
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

    for (
      let col = startCol, row = startRow;
      col >= 0 && row <= rowLength;
      col--, row++
    ) {
      const cell = board.at(col)?.at(row);
      if (cell) diagonal.push(cell);
    }

    if (diagonal.length >= 4) {
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

const checkCells = (cells: State.Cell[]): State.GameStatusWinner | "none" => {
  let winningCells = [];

  for (let i = 1; i < cells.length; i++) {
    // if cell is not open and new cell is equal to previous cell store the cell in winningCells.
    // only if we have stored 4 or more duplicates (meaning four or more of the same cells)
    // we assume a winner.
    const cell = cells.at(i);
    if (cell?.status !== "open" && cell?.status === cells[i - 1].status) {
      // for first match also store previous cell
      if (winningCells.length === 0) {
        winningCells.push(cells[i - 1]);
      }

      // store current cell
      winningCells.push(cell);

      if (winningCells.length >= 4) {
        return {
          status: "winner",
          player: cell.status,
          winningCells,
        };
      }
    } else {
      winningCells = [];
    }
  }

  return "none";
};

export const checkBoardState = (board: State.Board): State.GameStatus => {
  const sequelsToCheck = [
    ...getVerticals(board),
    ...getHorizontals(board),
    ...getDiagonalsTopToBottom(board),
    ...getDiagonalsBottomToTop(board),
  ];

  for (let cells of sequelsToCheck) {
    const result = checkCells(cells);
    if (result !== "none") {
      return result;
    }
  }

  return { status: "playing" };
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
  const openIndex = column.findLastIndex(
    ({ status }: State.Cell) => status === "open"
  );
  if (openIndex < 0) {
    return board;
  }

  const newColumn = replace(column, openIndex, {
    ...column[openIndex],
    status: player,
  });
  return replace(board, columnIndex, newColumn);
};

const replace = <T>(list: T[], idx: number, newVal: T): T[] => {
  return [...list.slice(0, idx), newVal, ...list.slice(idx + 1)];
};

const makeColumn = (colIdx: number, length: number): State.Column =>
  Array.from({ length }, (_v, cellIdentifier) => ({
    identifier: `${colIdx}x${cellIdentifier}`,
    status: "open",
  }));

export const makeBoard = (
  width: number = BOARD_WIDTH,
  height: number = BOARD_HEIGHT
): State.Board =>
  Array.from({ length: width }, (_v, idx) => makeColumn(idx, height));
