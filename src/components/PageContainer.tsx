import { Outlet } from "react-router-dom";
import { Stack } from "@mui/joy";

import { useAlertContext } from "./AlertContext";
import { AlertDisplay } from "./AlertDisplay";
import NavBar from "../components/NavBar";
import SettingsDrawer from "./SettingsDrawer";
import { useUserContext } from "../contexts/UserContextProvider";
import RequireLoginDialog from "../dialogs/RequireLoginDialog";
import { Fragment } from "react";
import { User } from "firebase/auth";

export default function PageContainer() {
  const { alertInfo, setAlertInfo } = useAlertContext();
  const { showLoginDialog, setShowLoginDialog } = useUserContext();

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
      {showLoginDialog && (
        <RequireLoginDialog
          onClose={(user: User | null) => {
            setShowLoginDialog(false);
            console.log("tripweather: user", user);
          }}
        />
      )}
    </Fragment>
  );
}
