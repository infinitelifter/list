export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number | Date;
  completedDate: number | Date;
}
