import { Metadata } from 'next'
import Layout from '../src/components/Layout';

export const metadata: Metadata = {
  title: 'OCoMa',
  description: 'An Open Comic books Manager.',
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
