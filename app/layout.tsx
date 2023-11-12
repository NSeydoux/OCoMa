import { Metadata } from 'next'
import Layout from '../src/components/Layout';
import { StyledEngineProvider } from '@mui/material/styles';

export const metadata: Metadata = {
  title: 'OCoMa',
  description: 'An Open Comicbooks Manager.',
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
        {/* The following is required to prevent custom CSS from being overriden. */}
        <StyledEngineProvider injectFirst>
          <Layout>{children}</Layout>
        </StyledEngineProvider>
      </body>
    </html>
  )
}
