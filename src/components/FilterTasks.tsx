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
  SelectChangeEvent,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RootState } from "../store/store";
import {
  setFilter,
  completeAllTasks,
  clearCompletedTasks,
  apiErrorOccurred,
  removeTask,
} from "../features/tasks/tasksSlice";
import { deleteTask, markComplete, markIncomplete } from "../api/taskApi";

const FilterTasks: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const completedCount = tasks.filter((task) => task.completed).length;
  const filter = useSelector((state: RootState) => state.tasks.filter);
  const completedTasks = tasks.filter((task) => task.completed);
  const allCompleted =
    tasks.length > 0 && tasks.every((task) => task.completed);

  const toggleAllTasksMutation = useMutation({
    mutationFn: async (newState: boolean) => {
      const tasksToUpdate = tasks.filter((task) => task.completed !== newState);
      const promises = tasksToUpdate.map((task) =>
        newState ? markComplete(task.id) : markIncomplete(task.id)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      dispatch(allCompleted ? clearCompletedTasks() : completeAllTasks());
    },
    onError: (error: Error) => {
      dispatch(apiErrorOccurred(error.message));
    },
  });

  const handleToggleAllTasks = () => {
    toggleAllTasksMutation.mutate(!allCompleted);
  };

  const handleFilterChange = (
    event: SelectChangeEvent<"all" | "completed" | "incomplete">
  ) => {
    dispatch(
      setFilter(event.target.value as "all" | "completed" | "incomplete")
    );
  };

  const deleteCompletedTasksMutation = useMutation({
    mutationFn: async () => {
      const promises = completedTasks.map((task) => deleteTask(task.id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      completedTasks.forEach((task) => {
        dispatch(removeTask(task.id));
      });
    },
    onError: (error: Error) => {
      dispatch(apiErrorOccurred(error.message));
    },
  });

  const handleDeleteCompleted = () => {
    deleteCompletedTasksMutation.mutate();
  };

  return (
    <Stack flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
      >
        <FormControl variant="outlined">
          <InputLabel id="filter-label">Filter Tasks</InputLabel>
          <Select
            labelId="filter-label"
            id="select-filter"
            value={filter}
            onChange={handleFilterChange}
            label="Filter Tasks"
            style={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="incomplete">Incomplete</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDeleteCompleted}
          disabled={tasks.every((task) => !task.completed)}
        >
          Remove Completed
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
      >
        <FormControlLabel
          control={
            <Switch
              checked={allCompleted}
              onChange={handleToggleAllTasks}
              color="primary"
            />
          }
          label="Select All"
          style={{ marginLeft: 20 }}
        />
        <Typography sx={{ mt: 2 }} variant="subtitle1">
          Completed Tasks: {completedCount}
        </Typography>
      </Box>
    </Stack>
  );
};

export default FilterTasks;
