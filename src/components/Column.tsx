import { State } from "@/types";
import { Cell } from "@/components";

interface ColumnProps {
  columnId: number;
  column: State.Column;
  onClick: (idx: number) => void;
}

export function Column(props: ColumnProps) {
  return (
    <div className="column" onClick={() => props.onClick(props.columnId)}>
      {props.column.map((cell: State.Cell, idx: number) => (
        <Cell cell={cell} key={`cell-${idx}`} />
      ))}
    </div>
  );
}
