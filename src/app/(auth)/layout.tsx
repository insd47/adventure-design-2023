import { ThemeProvider } from '@insd47/library';
import '../globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ThemeProvider>
  )
}
