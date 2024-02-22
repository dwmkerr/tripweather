import { Outlet } from "react-router-dom";
import Box from "@mui/joy/Box";
import { Stack } from "@mui/joy";

import { useAlertContext } from "./AlertContext";
import { AlertSnackbar } from "./AlertSnackbar";
import NavBar from "../components/NavBar";

export default function PageContainer() {
  const { alertInfo, setAlertInfo } = useAlertContext();

  return (
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
      <NavBar />
      <Stack
        component="main"
        direction="column"
        sx={{
          height: "100%",
        }}
      >
        <Outlet />
        {alertInfo && (
          <AlertSnackbar
            alertInfo={alertInfo}
            onDismiss={() => setAlertInfo(null)}
          />
        )}
      </Stack>
    </Box>
  );
}
