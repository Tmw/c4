import { describe, expect, it } from "vitest";
import { makeBoard, putCell } from "./board-utils";

describe("makeBoard", () => {
  it("created a new board", () => {
    const board = makeBoard(2, 2);

    expect(board).toEqual([
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
    expect(board.at(0)).toEqual(["open", "open", "open", "red"]);
  });

  it("ignores incorrect columns", () => {
    let board = makeBoard(3, 4);
    board = putCell(board, 6, "yellow");
    expect(board).toEqual([
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
    expect(board.at(2)).toEqual(["red", "yellow", "red", "yellow"]);
  });
});
