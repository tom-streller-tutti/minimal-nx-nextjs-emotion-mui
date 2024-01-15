'use client';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SText = styled('span')`
  font-style: italic;
`;

export default function HomePage() {
  return (
    <>
      <Typography variant="h1">App</Typography>
      <Typography variant="body1">
        This is a test app demonstrating using NX, Next.js 14 and{' '}
        <SText>MUI with Emotion v11</SText>.
      </Typography>
    </>
  );
}
