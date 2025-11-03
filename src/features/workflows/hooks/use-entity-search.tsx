import { useEffect, useState } from "react";
import { PAGINATION } from "@/config/constants";

interface UseEntitySearchProps<
  T extends {
    search: string;
    page: number;
  },
> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<
  T extends {
    search: string;
    page: number;
  },
>({ params, setParams, debounceMs = 500 }: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  /**
   * Effect to handle debounced search parameter updates
   * - If localSearch is cleared and params.search is not, reset params.search and page
   * - Otherwise, set a timeout to update params.search after debounceMs
   * - Cleanup the timeout on effect cleanup
   */
  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({ ...params, search: "", page: PAGINATION.DEFAULT_PAGE });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params.search, setParams, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return { searchValue: localSearch, onSearchChange: setLocalSearch };
}
