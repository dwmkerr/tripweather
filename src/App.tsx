import { StrictMode } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import { AlertContextProvider } from "./components/AlertContext";
import PageContainer from "./components/PageContainer";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageContainer />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "welcome",
        element: <WelcomePage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <StrictMode>
      <AlertContextProvider>
        <CssVarsProvider disableTransitionOnChange>
          <CssBaseline />
          <RouterProvider router={router} />
        </CssVarsProvider>
      </AlertContextProvider>
    </StrictMode>
  );
}
