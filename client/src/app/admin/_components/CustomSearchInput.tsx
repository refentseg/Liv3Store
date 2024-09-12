import { debounce } from "lodash";
import { useCallback } from "react";

export default function CustomSearchInput ({onSearch,searchQuery}:{onSearch: (value: string) => void;searchQuery:string}){
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
      }
    return(
        <input 
            placeholder="Search..."
            className="p-2 w-[500px] border-2 border-gray-60 mb-2 bg-transparent focus:outline-0 mt-4"
            value={searchQuery}
            onChange={handleChange}
        />
    )
}