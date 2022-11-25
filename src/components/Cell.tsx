import React from "react";
import { State } from "@/types";

interface CellProps {
  cell: State.Cell;
}

export const Cell: React.FC<CellProps> = (props: CellProps) => {
  return <div className={`cell cell-state-${props.cell}`}></div>;
};
