import React, { createContext, useContext, useState, useMemo } from 'react';

export type DataRow = Record<string, string | number>;
export type FilterState = Record<string, (string | number)[]>;

interface FilterContextType {
  data: DataRow[];
  setData: (data: DataRow[]) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filteredData: DataRow[];
  setFilterValue: (col: string, values: (string | number)[]) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [filters, setFilters] = useState<FilterState>({});

  // Compute filtered data based on filters
  const filteredData = useMemo(() => {
    return data.filter(row =>
      Object.entries(filters).every(([col, vals]) =>
        vals.length === 0 || vals.includes(row[col])
      )
    );
  }, [data, filters]);

  const setFilterValue = (col: string, values: (string | number)[]) => {
    setFilters(prev => ({ ...prev, [col]: values }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <FilterContext.Provider value={{ data, setData, filters, setFilters, filteredData, setFilterValue, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
}; 