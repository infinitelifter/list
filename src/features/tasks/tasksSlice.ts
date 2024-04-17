import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "./types";

export type FilterOptions = "all" | "completed" | "incomplete";

interface TasksState {
  tasks: Task[];
  filter: FilterOptions;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  filter: "all",
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    updateTaskText: (
      state,
      action: PayloadAction<{ id: string; text: string }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.text = action.payload.text;
      }
    },
    completeAllTasks: (state) => {
      state.tasks.forEach((task) => (task.completed = true));
    },
    clearCompletedTasks: (state) => {
      state.tasks.forEach((task) => (task.completed = false));
    },
    setFilter: (state, action: PayloadAction<FilterOptions>) => {
      state.filter = action.payload;
    },
    apiErrorOccurred: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  removeTask,
  toggleTask,
  updateTaskText,
  completeAllTasks,
  clearCompletedTasks,
  setFilter,
  apiErrorOccurred,
} = tasksSlice.actions;
export default tasksSlice.reducer;
