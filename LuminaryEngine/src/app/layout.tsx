import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://luminaryaiengine.dpdns.org'),
  title: 'Luminary AI Engine | Multi-Model Prompt Engineering',
  description: 'A multi-model prompt engineering and optimization workspace by Luminary Technicals.',
  applicationName: 'Luminary AI Engine',
  keywords: ['Luminary AI Engine', 'AI', 'multi-model', 'prompt engineering', 'OpenRouter'],
  authors: [{ name: 'Luminary Technicals', url: 'https://luminarytechnicals.dpdns.org/' }],
  openGraph: {
    title: 'Luminary AI Engine | Multi-Model Prompt Engineering',
    description: 'Generate, critique and refine stronger prompts with multiple AI models.',
    url: '/',
    siteName: 'Luminary AI Engine',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luminary AI Engine | Multi-Model Prompt Engineering',
    description: 'A multi-model prompt engineering and optimization workspace by Luminary Technicals.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Share+Tech+Mono&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mono antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
