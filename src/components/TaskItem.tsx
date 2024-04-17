import React, { useState, useCallback } from "react";
import {
  Checkbox,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  removeTask,
  toggleTask,
  updateTaskText,
  apiErrorOccurred,
} from "../features/tasks/tasksSlice";
import { Task } from "../features/tasks/types";
import {
  deleteTask,
  updateTask,
  markComplete,
  markIncomplete,
} from "../api/taskApi";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleError = useCallback(
    (error: Error) => {
      dispatch(apiErrorOccurred(error.message));
    },
    [dispatch]
  );

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      dispatch(removeTask(task.id));
    },
    onError: handleError,
  });

  const updateTextMutation = useMutation({
    mutationFn: () => updateTask(task.id, { text: editedText }),
    onSuccess: (updatedTask: Task) => {
      dispatch(updateTaskText({ id: task.id, text: updatedTask.text }));
      setEditMode(false);
    },
    onError: (error: Error) => {
      handleError(error);
      setEditMode(false);
    },
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: () =>
      task.completed ? markIncomplete(task.id) : markComplete(task.id),
    onSuccess: () => {
      dispatch(toggleTask(task.id));
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: handleError,
  });

  const handleToggleCompleted = useCallback(() => {
    toggleCompletionMutation.mutate();
  }, [toggleCompletionMutation]);

  const handleBlurUpdateText = useCallback(() => {
    if (editedText !== task.text) {
      updateTextMutation.mutate();
    }
    setEditMode(false);
  }, [editedText, task.text, updateTextMutation]);

  const handleChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedText(e.target.value);
    },
    []
  );

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => deleteMutation.mutate()}
        >
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
    >
      <Checkbox
        edge="start"
        checked={task.completed}
        tabIndex={-1}
        disableRipple
        inputProps={{ "aria-labelledby": `checkbox-list-label-${task.id}` }}
        onClick={handleToggleCompleted}
      />
      {editMode ? (
        <TextField
          value={editedText}
          onChange={handleChangeText}
          onBlur={handleBlurUpdateText}
          autoFocus
          fullWidth
        />
      ) : (
        <Typography
          sx={{
            textDecoration: task.completed ? "line-through" : "none",
            cursor: "pointer",
          }}
          onClick={() => setEditMode(true)}
        >
          {task.text}
        </Typography>
      )}
    </ListItem>
  );
};

export default TaskItem;
