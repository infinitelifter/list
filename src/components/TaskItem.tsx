import React, { useState } from "react";
import {
  Checkbox,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "../features/tasks/types";
import {
  deleteTask,
  updateTask,
  markComplete,
  markIncomplete,
} from "../api/taskApi";
import { useDispatch } from "react-redux";
import {
  apiErrorOccurred,
  removeTask,
  toggleTask,
  updateTaskText,
} from "../features/tasks/tasksSlice";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      dispatch(removeTask(task.id));
    },
    onError: (error: Error) => {
      dispatch(apiErrorOccurred(error.message));
    },
  });

  const updateTextMutation = useMutation({
    mutationFn: () => updateTask(task.id, { text: editedText }),
    onSuccess: (updatedTask: Task) => {
      dispatch(updateTaskText({ id: task.id, text: updatedTask.text }));
      setEditMode(false);
    },
    onError: (error: Error) => {
      dispatch(apiErrorOccurred(error.message));
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
    onError: (error: Error) => {
      dispatch(apiErrorOccurred(error.message));
    },
  });

  const handleToggleCompleted = () => {
    toggleCompletionMutation.mutate();
  };

  const handleBlurUpdateText = () => {
    console.log(editedText, task.text);
    if (editedText !== task.text) {
      updateTextMutation.mutate();
    }
    setEditMode(false);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  return (
    <>
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
          onClick={(e) => {
            e.stopPropagation();
            handleToggleCompleted();
          }}
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
    </>
  );
};

export default TaskItem;
