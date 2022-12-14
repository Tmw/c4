import { useReducer } from "react";
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

type MakeAction<N extends string, P extends object> = {
  type: N;
  payload: P;
};

type SetCellAction = MakeAction<
  "SetCellAction",
  { columnId: number; player: State.Player }
>;
type ResetGameAction = MakeAction<"ResetGameAction", {}>;
type Action = SetCellAction | ResetGameAction;

function reducer(state: State.GameState, action: Action): State.GameState {
  switch (action.type) {
    case "SetCellAction": {
      const newBoard = putCell(
        state.board,
        action.payload.columnId,
        state.currentPlayer
      );

      return {
        ...state,

        currentPlayer: oppositePlayer(state.currentPlayer),
        board: newBoard,
        status: checkBoardState(newBoard),
      };
    }

    case "ResetGameAction": {
      return initialState();
    }
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState());

  const playColumn = (columnId: number) => {
    dispatch({
      type: "SetCellAction",
      payload: {
        columnId: columnId,
        player: state.currentPlayer,
      },
    });
  };

  const restartGame = () => dispatch({ type: "ResetGameAction", payload: {} });

  return { ...state, playColumn, restartGame } as const;
}
