// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Raindrops Game Clone',
  description: 'A simple Raindrops math game clone using Next.js and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
