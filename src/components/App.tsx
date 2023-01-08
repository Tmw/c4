import { useGameState } from "@/hooks/useGameState";
import { Board, GameOver } from "@/components";
import "@/assets/css/app.css";

export default function App() {
  const { currentPlayer, board, status, playColumn, restartGame } =
    useGameState();

  return (
    <div className="app">
      {status.status !== "playing" && (
        <GameOver status={status} onRestartClicked={restartGame} />
      )}

      <Board
        currentPlayer={currentPlayer}
        board={board}
        status={status}
        onColumnClicked={(idx: number) => playColumn(idx)}
        isDisabled={status.status !== "playing"}
      />
    </div>
  );
}
