import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask as apiAddTask, deleteTask } from "../api/taskApi";
import {
  addTask,
  apiErrorOccurred,
  removeTask,
} from "../features/tasks/tasksSlice";
import { Task } from "../features/tasks/types";
import { RootState } from "../store/store";

const AddTaskForm: React.FC = () => {
  const [taskText, setTaskText] = useState("");
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const completedTasks = tasks.filter((task) => task.completed);

  const addTaskMutation = useMutation<Task, Error, string>({
    mutationFn: apiAddTask,
    onSuccess: (newTask) => {
      dispatch(addTask(newTask));
      setTaskText("");
    },
    onError: (error) => {
      dispatch(apiErrorOccurred(error.message));
    },
  });

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (taskText.trim()) {
      await addTaskMutation.mutateAsync(taskText.trim());
    }
  };

  const handleDeleteCompleted = () => {
    deleteCompletedTasksMutation.mutate();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="task"
        label="Add a Task"
        name="task"
        autoComplete="off"
        autoFocus
        value={taskText}
        onChange={handleInputChange}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!taskText.trim()}
      >
        Add Task
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleDeleteCompleted}
        disabled={!completedTasks.length}
      >
        Remove Completed
      </Button>
    </Box>
  );
};

export default AddTaskForm;
