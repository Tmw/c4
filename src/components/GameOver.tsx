import type { State } from "@/types";

interface GameOverProps {
  status: State.GameStatus;
  onRestartClicked: () => void;
}

export function GameOver({
  status,
  onRestartClicked,
}: GameOverProps): React.ReactElement {
  const capitalize = (s: string): string =>
    `${s.charAt(0).toUpperCase()}${s.substring(1)}`;

  const renderWinner = (status: State.GameStatus): string => {
    switch (status.status) {
      case "draw":
        return "Draw!";

      case "winner":
        return `${capitalize(status.player)} won!`;

      case "playing":
        throw new Error("should be unreachable");
    }
  };

  return (
    <>
      <div className="game-over">
        <h1>Game over!</h1>
        <p>{renderWinner(status)}</p>
        <button onClick={onRestartClicked}>New Game</button>
      </div>
    </>
  );
}
