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
          {/* // NB: These props are resolved server-side, as this is a Server component. */}
          <Layout deploymentUrl={process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : "http://localhost:3000/"}>
            {children}
          </Layout>
        </StyledEngineProvider>
      </body>
    </html>
  )
}
