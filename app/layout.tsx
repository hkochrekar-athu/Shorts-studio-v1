import './globals.css';

export const metadata = {
  title: 'Shorts Studio',
  description: 'AI Shorts Content Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}