import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, CircularProgress, List } from "@mui/material";
import TaskItem from "./TaskItem";
import { fetchTasks } from "../api/taskApi";
import { setTasks } from "../features/tasks/tasksSlice";
import { RootState } from "../store/store";
import { Task } from "../features/tasks/types";

const TasksList: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filter = useSelector((state: RootState) => state.tasks.filter);

  const { data, isError, error, isLoading } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  useEffect(() => {
    if (data) {
      dispatch(setTasks(data));
    }
  }, [data, dispatch]);

  const filteredTasks = React.useMemo(() => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "incomplete":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" pt={8}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return <Alert severity="error">Error: {error?.message}</Alert>;
  }

  return (
    <List>
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </List>
  );
};

export default TasksList;
