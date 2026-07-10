export const metadata = {
  title:       'Clover 🍀 — Telegram AI Assistant Bot',
  description: 'Telegram AI Assistant Bot with persistent memory and multi-provider AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
