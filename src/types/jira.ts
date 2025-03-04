export interface JiraCSVRow {
  'Issue Key': string;
  'Issue Type': string;
  Summary: string;
  Priority: string;
  Status: string;
  Assignee: string;
  Reporter: string;
  Created: string;
  Updated: string;
  'Due Date': string;
  Resolution: string;
  'Project Key': string;
  'Project Name': string;
  'Time Estimate': string;
  'Time Spent': string;
  Labels: string;
  Description: string;
  [key: string]: string;
}

export interface Task {
  issueKey: string;
  taskName: string;
  priority: string;
  dueDate: string;
  effortHours: number;
  priorityScore: number;
}