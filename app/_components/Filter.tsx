import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "./DebouncedInput";

const disabledFilterColumn = ["submittedTime", "chain", "isAccepted"];

export function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  const isDisabled = disabledFilterColumn.includes(column.id);
  if (isDisabled) return null;

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      className="font-normal p-1 bg-transparent border-b border-stone-400 focus:border-stone-500 focus:outline-none text-stone-800"
      style={{ width: column.getSize() }}
      list={column.id + "list"}
    />
  );
}
