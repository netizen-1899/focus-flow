import React from 'react';
import styles from '../styles/TaskList.module.css';
import { Task } from '@/types/jira';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (!tasks.length) return <p className={styles.noTasks}>No tasks to display. Upload a Jira CSV to get started.</p>;

  const priorityColors: { [key: string]: string } = {
    Highest: '#D32F2F',
    High: '#F44336',
    Medium: '#FF9800',
    Low: '#4CAF50',
    Lowest: '#2196F3',
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.containerTitle}>Task Flow</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Issue Key</th>
            <th>Task Name</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Effort (Hours)</th>
            <th>Priority Score</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.issueKey}>
              <td>{task.issueKey}</td>
              <td>{task.taskName}</td>
              <td>
                <span
                  className={styles.priorityDot}
                  style={{ backgroundColor: priorityColors[task.priority] || '#666' }}
                />
                {task.priority}
              </td>
              <td>{task.dueDate}</td>
              <td>{task.effortHours.toFixed(1)}</td>
              <td>{task.priorityScore.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;