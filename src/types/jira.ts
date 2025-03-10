export interface JiraCSVRow {
  'Issue Key': string;
  'Summary': string;
  'Priority': string;
  'Due Date': string;
  'Time Estimate': string;
  'Story Points': string;
}

export interface Task {
  issueKey: string;
  taskName: string;
  priority: string;
  dueDate: string;
  effortHours: number;
  storyPoints: number;
  priorityScore: number;
}