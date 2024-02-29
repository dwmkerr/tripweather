import { Outlet } from "react-router-dom";
import { Stack } from "@mui/joy";

import { useAlertContext } from "./AlertContext";
import { AlertSnackbar } from "./AlertSnackbar";
import NavBar from "../components/NavBar";
import SettingsDrawer from "./SettingsDrawer";

export default function PageContainer() {
  const { alertInfo, setAlertInfo } = useAlertContext();

  return (
    <Stack
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
        flexGrow={1}
        alignItems="flex-start"
      >
        <SettingsDrawer />
        <Outlet />
        {alertInfo && (
          <AlertSnackbar
            alertInfo={alertInfo}
            onDismiss={() => setAlertInfo(null)}
          />
        )}
      </Stack>
    </Stack>
  );
}
