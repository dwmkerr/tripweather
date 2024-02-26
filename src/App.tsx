import { StrictMode } from "react";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import TripPage from "./pages/TripPage";
import { AlertContextProvider } from "./components/AlertContext";
import PageContainer from "./components/PageContainer";
import ErrorPage from "./pages/ErrorPage";
import { SettingsContextProvider } from "./contexts/SettingsContextProvider";

const materialTheme = materialExtendTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageContainer />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <WelcomePage />,
      },
      {
        path: "trip",
        element: <TripPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <StrictMode>
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <AlertContextProvider>
          <SettingsContextProvider>
            <JoyCssVarsProvider>
              <CssBaseline />
              <RouterProvider router={router} />
            </JoyCssVarsProvider>
          </SettingsContextProvider>
        </AlertContextProvider>
      </MaterialCssVarsProvider>
    </StrictMode>
  );
}
