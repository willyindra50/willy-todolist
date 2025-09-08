// src/store/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  completed: 'all' | 'active' | 'completed';
  priority: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
  sort: 'date' | 'priority';
  order: 'asc' | 'desc';
  viewMode: 'scroll' | 'page';
};

const initialState: State = {
  completed: 'all',
  priority: 'ALL',
  sort: 'date',
  order: 'asc',
  viewMode: 'scroll',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCompleted(state, action: PayloadAction<State['completed']>) {
      state.completed = action.payload;
    },
    setPriority(state, action: PayloadAction<State['priority']>) {
      state.priority = action.payload;
    },
    setSort(state, action: PayloadAction<State['sort']>) {
      state.sort = action.payload;
    },
    setOrder(state, action: PayloadAction<State['order']>) {
      state.order = action.payload;
    },
    setViewMode(state, action: PayloadAction<State['viewMode']>) {
      state.viewMode = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setCompleted,
  setPriority,
  setSort,
  setOrder,
  setViewMode,
  resetFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
