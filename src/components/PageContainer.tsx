import { Outlet } from "react-router-dom";
import { Stack } from "@mui/joy";

import { useAlertContext } from "./AlertContext";
import { AlertDisplay } from "./AlertDisplay";
import NavBar from "../components/NavBar";
import SettingsDrawer from "./SettingsDrawer";
import { Fragment } from "react";

export default function PageContainer() {
  const { alertInfo, setAlertInfo } = useAlertContext();

  return (
    <Fragment>
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
            <AlertDisplay
              alertInfo={alertInfo}
              onDismiss={() => setAlertInfo(null)}
            />
          )}
        </Stack>
      </Stack>
    </Fragment>
  );
}
