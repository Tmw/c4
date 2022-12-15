export namespace State {
  export type Player = "red" | "yellow";
  export type CellState = "open" | Player;
  export type Cell = {
    identifier: string;
    status: CellState;
  };
  export type Column = Cell[];
  export type Board = Column[];

  export type GameStatus =
    | { status: "playing" | "draw" }
    | { status: "winner"; player: Player };

  export type GameState = {
    status: GameStatus;
    board: Board;
    currentPlayer: Player;
  };
}
