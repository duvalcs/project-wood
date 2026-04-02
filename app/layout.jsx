import './globals.css'

export const metadata = {
  title: 'Project Wood | Artisanal Decks in Louisville',
  description: 'Louisville\'s trusted artisans for beautiful, custom-built cedar and composite outdoor decks.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,700&family=Work+Sans:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      </head>
      <body>{children}</body>
    </html>
  )
}
