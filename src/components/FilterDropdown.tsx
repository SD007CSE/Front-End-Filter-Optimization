import React, { useMemo, useState } from 'react';
import { Checkbox, ListItemText, MenuItem, Select, InputLabel, FormControl, OutlinedInput, TextField, Box, Typography, Slider } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

interface FilterDropdownProps {
  label: string;
  options: (string | number)[];
  selected: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  numericFields?: {
    number?: boolean;
    mod350?: boolean;
    mod8000?: boolean;
    mod20002?: boolean;
  };
}

const ITEM_HEIGHT = 48;
const LIST_HEIGHT = 300;

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, onChange, numericFields = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [numberRange, setNumberRange] = useState<[number, number]>([0, 100]);
  const [mod350Range, setMod350Range] = useState<[number, number]>([0, 349]);
  const [mod8000Range, setMod8000Range] = useState<[number, number]>([0, 7999]);
  const [mod20002Range, setMod20002Range] = useState<[number, number]>([0, 20001]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const numericOptions = useMemo(() => {
    return options.filter(option => typeof option === 'number') as number[];
  }, [options]);

  const minMax = useMemo(() => {
    if (numericOptions.length === 0) return { min: 0, max: 100 };
    return {
      min: Math.min(...numericOptions),
      max: Math.max(...numericOptions)
    };
  }, [numericOptions]);

  const filteredOptions = useMemo(() => {
    return options.filter(option => {
      const matchesSearch = String(option).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNumberRange = typeof option === 'number' && numericFields.number
        ? option >= numberRange[0] && option <= numberRange[1]
        : true;
      const matchesMod350 = typeof option === 'number' && numericFields.mod350
        ? (option % 350) >= mod350Range[0] && (option % 350) <= mod350Range[1]
        : true;
      const matchesMod8000 = typeof option === 'number' && numericFields.mod8000
        ? (option % 8000) >= mod8000Range[0] && (option % 8000) <= mod8000Range[1]
        : true;
      const matchesMod20002 = typeof option === 'number' && numericFields.mod20002
        ? (option % 20002) >= mod20002Range[0] && (option % 20002) <= mod20002Range[1]
        : true;
      return matchesSearch && matchesNumberRange && matchesMod350 && matchesMod8000 && matchesMod20002;
    });
  }, [options, searchTerm, numberRange, mod350Range, mod8000Range, mod20002Range, numericFields]);

  const handleChange = (event: any) => {
    const value = event.target.value;
    onChange(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNumberRangeChange = (event: Event, newValue: number | number[]) => {
    setNumberRange(newValue as [number, number]);
  };
  const handleMod350RangeChange = (event: Event, newValue: number | number[]) => {
    setMod350Range(newValue as [number, number]);
  };
  const handleMod8000RangeChange = (event: Event, newValue: number | number[]) => {
    setMod8000Range(newValue as [number, number]);
  };
  const handleMod20002RangeChange = (event: Event, newValue: number | number[]) => {
    setMod20002Range(newValue as [number, number]);
  };

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const option = filteredOptions[index];
    const isSelected = selectedSet.has(option);

    const handleClick = () => {
      const newSelected = isSelected
        ? selected.filter(item => item !== option)
        : [...selected, option];
      onChange(newSelected);
    };

    return (
      <MenuItem
        key={option}
        value={option}
        style={style}
        onClick={handleClick}
      >
        <Checkbox checked={isSelected} />
        <ListItemText primary={option} />
      </MenuItem>
    );
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={selected => (selected as (string | number)[]).join(', ')}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: LIST_HEIGHT,
            },
          },
        }}
      >
        <Box sx={{ p: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
          <TextField
            size="small"
            placeholder="Search..."
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
            sx={{ mb: 1 }}
          />
          {numericOptions.length > 0 && (
            <Box sx={{ px: 1 }}>
              {numericFields.number && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Number Range
                  </Typography>
                  <Slider
                    value={numberRange}
                    onChange={handleNumberRangeChange}
                    valueLabelDisplay="auto"
                    min={minMax.min}
                    max={minMax.max}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                    <Typography variant="caption">{numberRange[0]}</Typography>
                    <Typography variant="caption">{numberRange[1]}</Typography>
                  </Box>
                </Box>
              )}
              {numericFields.mod350 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Mod 350 Range
                  </Typography>
                  <Slider
                    value={mod350Range}
                    onChange={handleMod350RangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={349}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                    <Typography variant="caption">{mod350Range[0]}</Typography>
                    <Typography variant="caption">{mod350Range[1]}</Typography>
                  </Box>
                </Box>
              )}
              {numericFields.mod8000 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Mod 8000 Range
                  </Typography>
                  <Slider
                    value={mod8000Range}
                    onChange={handleMod8000RangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={7999}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                    <Typography variant="caption">{mod8000Range[0]}</Typography>
                    <Typography variant="caption">{mod8000Range[1]}</Typography>
                  </Box>
                </Box>
              )}
              {numericFields.mod20002 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Mod 20002 Range
                  </Typography>
                  <Slider
                    value={mod20002Range}
                    onChange={handleMod20002RangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={20001}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                    <Typography variant="caption">{mod20002Range[0]}</Typography>
                    <Typography variant="caption">{mod20002Range[1]}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <List
          height={LIST_HEIGHT - (numericOptions.length > 0 ? 140 : 60)}
          itemCount={filteredOptions.length}
          itemSize={ITEM_HEIGHT}
          width="100%"
        >
          {renderRow}
        </List>
      </Select>
    </FormControl>
  );
};

export default FilterDropdown; 