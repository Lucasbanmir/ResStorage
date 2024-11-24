import localFont from "next/font/local";
import "./globals.css";
import * as React from 'react';
import { Box, Container,CssBaseline, Paper } from "@mui/material";
import Menu from './components/menu';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (    
    <html lang="pt-br">
      <body
        style={{ backgroundColor: "#f0f0f0" }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CssBaseline enableColorScheme />
        <Menu/>
        <Container
          maxWidth={false}
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 16, gap: 4 }}
        >
          <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '2200px' } }}>
            <Paper sx={{ padding: '100px' }}>
              {children}
            </Paper>
          </Box>
        </Container>
      </body>
    </html>
  );
}