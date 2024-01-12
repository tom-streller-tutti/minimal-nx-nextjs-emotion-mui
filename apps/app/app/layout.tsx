/* @jsxImportSource react */

import '@fontsource/roboto';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Container, CssBaseline } from '@mui/material';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          <Container>{children}</Container>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}