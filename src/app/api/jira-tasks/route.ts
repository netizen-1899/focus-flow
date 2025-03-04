import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { JiraIssue, Task } from '../../../types/jira';

const calculatePriorityScore = (task: JiraIssue): number => {
  const dueDateStr = task.fields.duedate;
  const priorityName = task.fields.priority.name;
  const timeEstimate = (task.fields.timeestimate || 0) / 3600;

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

  const effortScore = timeEstimate ? Math.max(0, 100 - timeEstimate * 10) : 50;

  return Math.min(100, Math.max(0, urgencyScore * 0.4 + importanceScore * 0.4 + effortScore * 0.2));
};

export async function POST(req: NextRequest) {
  const { email, apiToken, baseUrl } = await req.json() as { email?: string; apiToken?: string; baseUrl?: string };

  if (!email || !apiToken || !baseUrl) {
    return NextResponse.json({ error: 'Missing Jira credentials or base URL' }, { status: 400 });
  }

  const authHeader = {
    headers: {
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const jql = 'assignee = currentUser() AND status != Done';
    const url = `${baseUrl}/rest/api/3/search`;
    const params = {
      jql,
      fields: 'summary,priority,duedate,timeestimate,status',
      maxResults: 50,
    };

    const response = await axios.get<{ issues: JiraIssue[] }>(url, { ...authHeader, params });
    const tasks = response.data.issues.map((task) => ({
      id: task.id,
      key: task.key,
      summary: task.fields.summary,
      priority: task.fields.priority.name,
      dueDate: task.fields.duedate || 'N/A',
      effortHours: (task.fields.timeestimate || 0) / 3600,
      status: task.fields.status.name,
      priorityScore: calculatePriorityScore(task),
    })).sort((a, b) => b.priorityScore - a.priorityScore);

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error('Jira API error:', error.message);
    return NextResponse.json(
      { error: error.response?.data?.errorMessages?.join(', ') || 'Failed to fetch tasks from Jira' },
      { status: error.response?.status || 500 }
    );
  }
}