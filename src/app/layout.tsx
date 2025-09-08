import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider'; // tambahkan ini

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ReactQueryProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
