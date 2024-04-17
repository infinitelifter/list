import { Task } from "../features/tasks/types";

const baseUrl = "http://localhost:8080";

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${baseUrl}/tasks`);
  if (!response.ok) {
    throw new Error("Network response not ok");
  }
  return response.json();
};
// export const fetchTasks = async (
//   filter: "all" | "completed"
// ): Promise<Task[]> => {
//   let url = `${baseUrl}/tasks`;
//   if (filter === "completed") {
//     url += `/completed`;
//   }
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Network response not ok");
//   }
//   return response.json();
// };

export const addTask = async (text: string): Promise<Task> => {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
};

export const updateTask = async (
  id: string,
  task: Partial<Task>
): Promise<Task> => {
  const response = await fetch(`${baseUrl}/tasks/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
};

export const markComplete = async (id: string): Promise<Task> => {
  const response = await fetch(`${baseUrl}/tasks/${id}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to complete task");
  }
  return response.json();
};

export const markIncomplete = async (id: string): Promise<Task> => {
  const response = await fetch(`${baseUrl}/tasks/${id}/incomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to incomplete task");
  }
  return response.json();
};
