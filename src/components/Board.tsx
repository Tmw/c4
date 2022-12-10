import type { State } from "@/types";
import { Column } from "@/components";

interface BoardProps {
  currentPlayer: State.Player;
  board: State.Board;
  isDisabled?: boolean;
  onColumnClicked: (idx: number) => void;
}
interface GameOverProps {
  status: State.GameStatus;
}

function GameOver({ status }: GameOverProps): React.ReactElement {
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
        <button onClick={() => alert("ok!")}>New Game</button>
      </div>
    </>
  );
}
export function Board({
  currentPlayer,
  board,
  isDisabled = false,
  onColumnClicked,
}: BoardProps): React.ReactElement {
  const enabledClass = isDisabled ? "disabled" : "enabled";

  return (
    <div className={`board ${enabledClass} current-player-${currentPlayer}`}>
      {board.map((column: State.Column, idx: number) => (
        <Column
          column={column}
          onClick={(idx: number) => !isDisabled && onColumnClicked(idx)}
          columnId={idx}
          key={`column-${idx}`}
        />
      ))}
    </div>
  );
}
