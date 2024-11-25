"use client";
import { SnackbarProvider } from "notistack";

const NotistackSnackbarProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <SnackbarProvider maxSnack={2}>{children}</SnackbarProvider>
  );
};

export default NotistackSnackbarProvider;