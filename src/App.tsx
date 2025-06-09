import React, { useEffect, useState } from 'react';
import { FilterProvider, useFilterContext } from './context/FilterContext';
import { loadCSV } from './utils/csvLoader';
import FilterDropdown from './components/FilterDropdown';
import DataTable from './components/DataTable';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

const DATASET_URL = process.env.PUBLIC_URL + '/dataset_large.csv';

const FiltersAndTable: React.FC = () => {
  const { data, setData, filters, setFilterValue, filteredData, resetFilters } = useFilterContext();
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    loadCSV(DATASET_URL).then(rows => {
      setData(rows);
      if (rows.length > 0) {
        setColumns(Object.keys(rows[0]));
      }
      setLoading(false);
    });
  }, []);

  const getOptions = (col: string) => {
    const filtered = data.filter(row =>
      Object.entries(filters).every(([fcol, vals]) =>
        fcol === col || vals.length === 0 || vals.includes(row[fcol])
      )
    );
    const unique = Array.from(new Set(filtered.map(row => row[col])));
    unique.sort((a, b) => Number(a) - Number(b));
    return unique;
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Front End Filter Optimization</Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        {columns.includes('number') && (
          <FilterDropdown
            key="number"
            label="number"
            options={getOptions('number')}
            selected={filters['number'] || []}
            onChange={vals => setFilterValue('number', vals)}
            numericFields={{ number: true, mod350: true, mod8000: true, mod20002: true }}
          />
        )}
        {columns.filter(col => col !== 'number').map(col => (
          <FilterDropdown
            key={col}
            label={col}
            options={getOptions(col)}
            selected={filters[col] || []}
            onChange={vals => setFilterValue(col, vals)}
          />
        ))}
        <Button variant="outlined" onClick={resetFilters} sx={{ alignSelf: 'center', height: 40 }}>Reset Filters</Button>
      </Box>
      <DataTable columns={columns} rows={filteredData} />
    </Box>
  );
};

const App: React.FC = () => (
  <FilterProvider>
    <FiltersAndTable />
  </FilterProvider>
);

export default App; 