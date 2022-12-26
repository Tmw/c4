export namespace State {
  export type Player = "red" | "yellow";
  export type CellState = "open" | Player;
  export type Cell = {
    identifier: string;
    status: CellState;
  };
  export type Column = Cell[];
  export type Board = Column[];

  export type GameStatusPlaying = { status: "playing" };
  export type GameStatusDraw = { status: "playing" };
  export type GameStatusWinner = {
    status: "winner";
    player: Player;
    winningCells: Cell[];
  };

  export type GameStatus =
    | GameStatusPlaying
    | GameStatusDraw
    | GameStatusWinner;

  export type GameState = {
    status: GameStatus;
    board: Board;
    currentPlayer: Player;
  };
}
