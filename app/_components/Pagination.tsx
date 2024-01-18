import { Table } from "@tanstack/react-table";
import { type getProposalData } from "../_utils/utils";

type Proposal = ReturnType<typeof getProposalData>[0];

interface PaginationProps {
  table: Table<Proposal>;
  setParam: (name: string, value: string | number) => void;
}

const Pagination = ({ table, setParam }: PaginationProps) => {
  return (
    <div className="flex justify-between w-full items-center">
      <div>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => setParam("show", e.target.value)}
          className="text-stone-500 border-stone-400 text-xs font-normal border p-2 bg-transparent"
        >
          {[10, 25, 50, 100, 500].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="flex text-sm">
        <button
          className="border-l  p-1 w-9 text-stone-500 border-stone-400 hover:bg-stone-200 cursor-pointer hover:text-stone-600"
          onClick={() => setParam("page", "1")}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border-l border-r  p-1 w-9 text-stone-500 border-stone-400 hover:bg-stone-200 cursor-pointer hover:text-stone-600"
          onClick={() => {
            const previousPage = table.getState().pagination.pageIndex;
            console.log("🚀 ~ Pagination ~ previousPage:", previousPage);
            setParam("page", previousPage);
          }}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>

        <span className="flex items-center gap-1 text-stone-500 px-3">
          <div>page</div>
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </span>

        <button
          className="border-l border-r  p-1 w-9 text-stone-500 border-stone-400 hover:bg-stone-200 cursor-pointer hover:text-stone-600"
          onClick={() => {
            const nextPage = table.getState().pagination.pageIndex + 2;
            setParam("page", nextPage);
          }}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border-r  p-1 w-9 text-stone-500 border-stone-400 hover:bg-stone-200 cursor-pointer hover:text-stone-600"
          onClick={() => setParam("page", table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>

      <div>
        <span className="flex items-center gap-1 text-stone-500 text-xs">
          go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              setParam("page", Number(e.target.value ?? 1));
            }}
            className="border px-1 py-2 w-16  border-stone-400 text-right bg-transparent"
          />
        </span>
      </div>
    </div>
  );
};

export default Pagination;
