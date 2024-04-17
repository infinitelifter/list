import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { addTask as apiAddTask } from "../api/taskApi";
import { addTask } from "../features/tasks/tasksSlice";
import { Task } from "../features/tasks/types";

const AddTaskForm: React.FC = () => {
  const [taskText, setTaskText] = useState("");
  const dispatch = useDispatch();

  const { mutateAsync } = useMutation<Task, Error, string, Task>({
    mutationFn: (text) => apiAddTask(text),
    onSuccess: (newTask) => {
      dispatch(addTask(newTask));
      setTaskText("");
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (taskText.trim()) {
      await mutateAsync(taskText.trim());
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
    >
      <TextField
        margin="normal"
        required
        id="task"
        label="Add a Task"
        name="task"
        autoComplete="off"
        autoFocus
        value={taskText}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!taskText.trim()}
      >
        Add Task
      </Button>
    </Box>
  );
};

export default AddTaskForm;
