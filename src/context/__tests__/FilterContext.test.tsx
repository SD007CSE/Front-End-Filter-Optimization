import React from 'react';
import { render, act } from '@testing-library/react';
import { FilterProvider, useFilterContext, DataRow } from '../FilterContext';

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { data, setData, filters, setFilterValue, filteredData, resetFilters } = useFilterContext();
  return (
    <div>
      <button onClick={() => setData([{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }])}>
        Set Data
      </button>
      <button onClick={() => setFilterValue('name', ['Test 1'])}>Set Filter</button>
      <button onClick={resetFilters}>Reset</button>
      <div data-testid="filtered-data">{JSON.stringify(filteredData)}</div>
      <div data-testid="filters">{JSON.stringify(filters)}</div>
    </div>
  );
};

describe('FilterContext', () => {
  it('should provide initial empty state', () => {
    const { getByTestId } = render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    expect(getByTestId('filtered-data').textContent).toBe('[]');
    expect(getByTestId('filters').textContent).toBe('{}');
  });

  it('should update data and filters correctly', () => {
    const { getByText, getByTestId } = render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    // Set initial data
    act(() => {
      getByText('Set Data').click();
    });

    // Set filter
    act(() => {
      getByText('Set Filter').click();
    });

    expect(getByTestId('filtered-data').textContent).toBe('[{"id":"1","name":"Test 1"}]');
    expect(getByTestId('filters').textContent).toBe('{"name":["Test 1"]}');

    // Reset filters
    act(() => {
      getByText('Reset').click();
    });

    expect(getByTestId('filtered-data').textContent).toBe('[{"id":"1","name":"Test 1"},{"id":"2","name":"Test 2"}]');
    expect(getByTestId('filters').textContent).toBe('{}');
  });

  it('should throw error when used outside provider', () => {
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFilterContext must be used within FilterProvider');

    console.error = consoleError;
  });
}); 