import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuoteIQ — AI Procurement Workspace',
  description:
    'Convert messy vendor quotations into comparable, evidence-backed sourcing analysis. AI-powered procurement workspace for corrugated packaging sourcing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
