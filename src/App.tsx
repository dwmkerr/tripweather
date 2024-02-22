import { CssVarsProvider } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";

import WelcomePage from "./pages/WelcomePage";
import { AlertContextProvider } from "./components/AlertContext";
import PageContainer from "./components/PageContainer";

export default function App() {
  return (
    <AlertContextProvider>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box
          sx={{
            height: "100vh",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            "& > div": {
              scrollSnapAlign: "start",
            },
          }}
        >
          <PageContainer>
            <WelcomePage />
          </PageContainer>
        </Box>
      </CssVarsProvider>
    </AlertContextProvider>
  );
}
