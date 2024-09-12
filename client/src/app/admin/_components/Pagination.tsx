
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
  };


export default function Pagination({currentPage,totalPages,pageSize,totalCount,onPageChange}:PaginationProps){
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
    <nav className="flex items-center justify-end border-t border-neutral-650  px-4 py-3 sm:px-6" aria-label="Pagination">
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-neutral-700 focus-visible:outline-offset-0 disabled:opacity-50 mr-2"
        >
          <ChevronLeft className="h-5 w-5 " />
          <span className="sr-only">Previous</span>
        </button>
        <div className="hidden md:block">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                currentPage === number
                  ? 'bg-red-900 text-white focus-visible:outline-offset-0 rounded-md'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-neutral-700 focus-visible:outline-offset-0'
              }`}
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-neutral-700 focus-visible:outline-offset-0 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </nav>
    );

}