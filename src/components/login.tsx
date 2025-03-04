import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import { JiraCredentials } from '@/types/jira';

interface LoginProps {
  onLogin: (credentials: JiraCredentials) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [apiToken, setApiToken] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !apiToken || !baseUrl) {
      setError('All fields are required');
      return;
    }

    const credentials: JiraCredentials = { email, apiToken, baseUrl };
    localStorage.setItem('jiraCredentials', JSON.stringify(credentials));
    setError(null);
    onLogin(credentials);
  };

  return (
    <div className={styles.container}>
      <h2>Login to Focus Flow</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
          />
        </div>
        <div className={styles.field}>
          <label>Jira API Token</label>
          <input
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Your Jira API token"
          />
        </div>
        <div className={styles.field}>
          <label>Jira Base URL</label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-domain.atlassian.net"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;