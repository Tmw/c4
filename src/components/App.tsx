import React, { useCallback } from "react";
import type { State } from "@/types";
import { useGameState } from "@/hooks/useGameState";
import { Column } from "@/components";

import "@/assets/css/app.css";

const renderGameStatus = (state: State.GameStatus): string => {
  switch (state.status) {
    case "draw":
    case "playing":
      return state.status;

    case "winner":
      return `player ${state.player} won!`;
  }
};

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
        current player: {currentPlayer} | game state: {renderGameStatus(status)}
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
