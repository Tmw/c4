import { useState } from "react";

import type { State } from "@/types";
import { makeBoard, checkBoardState, putCell } from "@/utils/board-utils";

const initialState = (): State.GameState => {
  return {
    status: { status: "playing" },
    currentPlayer: "yellow",
    board: makeBoard(),
  };
};

const oppositePlayer = (player: State.Player): State.Player =>
  player === "red" ? "yellow" : "red";

export function useGameState() {
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

  const restartGame = () => setGameState(initialState());

  return { ...state, playColumn, restartGame } as const;
}
