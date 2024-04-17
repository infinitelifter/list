import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Stack,
  SelectChangeEvent,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RootState } from "../store/store";
import {
  setFilter,
  completeAllTasks,
  clearCompletedTasks,
  apiErrorOccurred,
  FilterOptions,
} from "../features/tasks/tasksSlice";
import { markComplete, markIncomplete } from "../api/taskApi";

const FilterTasks: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filter = useSelector((state: RootState) => state.tasks.filter);
  const completedCount = tasks.filter((task) => task.completed).length;
  const allCompleted = tasks.every((task) => task.completed);

  const toggleAllTasks = useMutation({
    mutationFn: async (newState: boolean) => {
      const tasksToUpdate = tasks.filter((task) => task.completed !== newState);
      return Promise.all(
        tasksToUpdate.map((task) =>
          newState ? markComplete(task.id) : markIncomplete(task.id)
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      dispatch(allCompleted ? clearCompletedTasks() : completeAllTasks());
    },
    onError: (error: Error) => dispatch(apiErrorOccurred(error.message)),
  });

  const handleToggleAllTasks = () => toggleAllTasks.mutate(!allCompleted);

  const handleFilterChange = (event: SelectChangeEvent<FilterOptions>) => {
    dispatch(setFilter(event.target.value as FilterOptions));
  };

  return (
    <Stack mt={3} spacing={3}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="filter-label">Filter Tasks</InputLabel>
        <Select
          labelId="filter-label"
          id="select-filter"
          value={filter}
          onChange={handleFilterChange}
          label="Filter Tasks"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="incomplete">Incomplete</MenuItem>
        </Select>
      </FormControl>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">
          Completed Tasks: {completedCount}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={allCompleted}
              onChange={handleToggleAllTasks}
              color="primary"
            />
          }
          label="Select All"
        />
      </Box>
    </Stack>
  );
};

export default FilterTasks;
