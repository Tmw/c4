import { describe, expect, it } from "vitest";
import { checkBoardState, makeBoard, putCell } from "./board-utils";
import type { State } from "@/types/index";

describe("makeBoard", () => {
  it("created a new board", () => {
    const board = makeBoard(2, 2);
    expect(flattenBoard(board)).toEqual([
      ["open", "open"],
      ["open", "open"],
    ]);

    expect(12).toEqual(12);
  });
});

describe("putCell", () => {
  it("places the correct cell", () => {
    let board = makeBoard(3, 4);
    board = putCell(board, 0, "red");
    expect(flattenColumn(board[0])).toEqual(["open", "open", "open", "red"]);
  });

  it("ignores incorrect columns", () => {
    let board = makeBoard(3, 4);
    board = putCell(board, 6, "yellow");
    expect(flattenBoard(board)).toEqual([
      ["open", "open", "open", "open"],
      ["open", "open", "open", "open"],
      ["open", "open", "open", "open"],
    ]);
  });

  it("ignores columns whose cells are already all taken", () => {
    let board = makeBoard(3, 4);

    for (let i = 0; i < 4; i++) {
      board = putCell(board, 2, i % 2 === 0 ? "yellow" : "red");
    }

    board = putCell(board, 2, "yellow");
    expect(flattenColumn(board[2])).toEqual(["red", "yellow", "red", "yellow"]);
  });
});

describe("checkBoardState", () => {
  it("should flag winner horizontally", () => {
    const board: State.Board = inflateBoard([
      ["open", "open", "yellow", "red"],
      ["open", "open", "yellow", "yellow"],
      ["open", "open", "yellow", "red"],
      ["open", "open", "yellow", "yellow"],
    ]);

    expect(checkBoardState(board)).toEqual({
      status: "winner",
      player: "yellow",
      winningCells: [
        { identifier: "2x0", status: "yellow" },
        { identifier: "2x1", status: "yellow" },
        { identifier: "2x2", status: "yellow" },
        { identifier: "2x3", status: "yellow" },
      ],
    });
  });

  it("should flag winner horizontally", () => {
    const board: State.Board = inflateBoard([
      ["yellow", "yellow", "yellow", "yellow"],
      ["open", "open", "red", "yellow"],
      ["open", "open", "yellow", "red"],
      ["open", "open", "yellow", "yellow"],
    ]);

    expect(checkBoardState(board)).toEqual({
      status: "winner",
      player: "yellow",
      winningCells: [
        { identifier: "0x0", status: "yellow" },
        { identifier: "1x0", status: "yellow" },
        { identifier: "2x0", status: "yellow" },
        { identifier: "3x0", status: "yellow" },
      ],
    });
  });

  it("should flag winner diagonal (top-to-bottom)", () => {
    const board: State.Board = inflateBoard([
      ["yellow", "yellow", "red", "yellow"],
      ["open", "yellow", "red", "yellow"],
      ["open", "open", "yellow", "red"],
      ["open", "open", "yellow", "yellow"],
    ]);

    expect(checkBoardState(board)).toEqual({
      status: "winner",
      player: "yellow",
      winningCells: [
        { identifier: "0x0", status: "yellow" },
        { identifier: "1x1", status: "yellow" },
        { identifier: "2x2", status: "yellow" },
        { identifier: "3x3", status: "yellow" },
      ],
    });
  });

  it("should flag winner diagonal (bottom-to-top)", () => {
    const board: State.Board = inflateBoard([
      ["open", "open", "yellow", "yellow"],
      ["open", "open", "yellow", "yellow"],
      ["open", "yellow", "red", "red"],
      ["yellow", "open", "yellow", "yellow"],
    ]);

    expect(checkBoardState(board)).toEqual({
      status: "winner",
      player: "yellow",
      winningCells: [
        { identifier: "0x3", status: "yellow" },
        { identifier: "1x2", status: "yellow" },
        { identifier: "2x1", status: "yellow" },
        { identifier: "3x0", status: "yellow" },
      ],
    });
  });

  it("should not flag winner if not four consecutive", () => {
    const board: State.Board = inflateBoard([
      ["open", "open", "open", "open", "open", "open"],
      ["open", "open", "open", "open", "open", "open"],
      ["open", "open", "open", "open", "open", "open"],
      ["open", "open", "open", "open", "open", "open"],
      ["open", "open", "open", "open", "open", "open"],
      ["yellow", "yellow", "open", "yellow", "yellow", "yellow"],
    ]);

    expect(checkBoardState(board)).toEqual({
      status: "playing",
    });
  });
});

function flattenColumn(column: State.Column): State.CellState[] {
  return column.map((cell) => cell.status);
}

function flattenBoard(board: State.Board): State.CellState[][] {
  return board.map(flattenColumn);
}

function inflateBoard(cells: State.CellState[][]): State.Board {
  return cells.map((col, colIdx) =>
    col.map((cell, cellIdx) => ({
      identifier: `${cellIdx}x${colIdx}`,
      status: cell,
    }))
  );
}
