'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import TaskList from '@/components/TaskList';
import styles from '../styles/Home.module.css';
import { JiraCSVRow, Task } from '@/types/jira';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculatePriorityScore = (task: JiraCSVRow): number => {
    const dueDateStr = task['Due Date'];
    const priorityName = task.Priority;
    const timeEstimateSeconds = parseFloat(task['Time Estimate']) || 0;
    const effortHours = timeEstimateSeconds / 3600;

    let urgencyScore = 50;
    if (dueDateStr) {
      const dueDate = new Date(dueDateStr);
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      urgencyScore = Math.max(0, 100 - daysUntilDue * 10);
    }

    const priorityMap: { [key: string]: number } = {
      Highest: 100,
      High: 75,
      Medium: 50,
      Low: 25,
      Lowest: 10,
    };
    const importanceScore = priorityMap[priorityName] || 50;

    const effortScore = effortHours ? Math.max(0, 100 - effortHours * 10) : 50;

    return Math.min(100, Math.max(0, urgencyScore * 0.4 + importanceScore * 0.4 + effortScore * 0.2));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      setError(null);
    } else {
      setError('Please upload a valid CSV file');
      setFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected'); // This message will use .formError styling
      return;
    }

    Papa.parse<JiraCSVRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedTasks = result.data
          .filter((task) => task['Issue Key'] && task.Summary)
          .map((task) => ({
            issueKey: task['Issue Key'],
            taskName: task.Summary,
            priority: task.Priority || 'Medium',
            dueDate: task['Due Date'] || 'N/A',
            effortHours: (parseFloat(task['Time Estimate']) || 0) / 3600,
            priorityScore: calculatePriorityScore(task),
          }))
          .sort((a, b) => b.priorityScore - a.priorityScore);

        setTasks(parsedTasks);
        setError(null);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Focus Flow</h1>
      </header>
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Upload Jira CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className={styles.input}
            />
          </div>
          {error && <p className={styles.formError}>{error}</p>}
          <button type="submit" className={styles.button}>Submit</button>
        </form>
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
}