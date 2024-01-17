import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "./DebouncedInput";

export function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        className="font-normal rounded p-1 bg-transparent border-b border-stone-400 focus:border-stone-500 focus:outline-none text-stone-800"
        list={column.id + "list"}
      />
    </>
  );
}
