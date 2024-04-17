import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RootState, store } from "./store/store";
import { queryClient } from "./api/queryClient";
import TasksList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import FilterTasks from "./components/FilterTasks";
import { Container } from "@mui/material";

const GlobalErrorSnackbar: React.FC = () => {
  const error = useSelector((state: RootState) => state.tasks.error);
  const [open, setOpen] = React.useState<boolean>(false);

  console.log("error", error);
  useEffect(() => {
    setOpen(!!error);
  }, [error]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => handleClose()}
      message={error || ""}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      ContentProps={{
        style: { backgroundColor: "red" },
      }}
    />
  );
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Container maxWidth="sm">
          <AddTaskForm />
          <FilterTasks />
          <TasksList />
          <GlobalErrorSnackbar />
        </Container>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
