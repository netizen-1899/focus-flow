import type { Metadata } from 'next';
import '@atlaskit/css-reset';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Focus Flow',
  description: 'A productivity tool for Jira task prioritization',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}