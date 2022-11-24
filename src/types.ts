export namespace State {
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
