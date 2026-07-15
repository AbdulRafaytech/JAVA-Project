export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Label {
  id?: number;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string; // LocalDate representation (YYYY-MM-DD)
  position: number;
  assignee?: string;
  createdAt?: string;
  updatedAt?: string;
  labels: Label[];
  columnId: number;
}

export interface Column {
  id: number;
  title: string;
  position: number;
  tasks: Task[];
}

export interface Board {
  id: number;
  title: string;
  description: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
  columns?: Column[];
}

export interface DashboardSummary {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  taskStatusCounts: Record<string, number>;
  taskPriorityCounts: Record<string, number>;
  recentBoards: Board[];
}
