import { State } from "@/types";

interface CellProps {
  cell: State.Cell;
}

export function Cell(props: CellProps) {
  return <div className={`cell cell-state-${props.cell}`}></div>;
}
