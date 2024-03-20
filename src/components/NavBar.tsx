import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/joy";
import Typography from "@mui/joy/Typography";

import TuneIcon from "@mui/icons-material/TuneRounded";

import NavigationList from "./NavigationMenu";
import logo from "../images/logo.png";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import UnitsSelect from "./UnitsSelect";
import { Repository } from "../lib/repository/Repository";
import { User, onAuthStateChanged } from "firebase/auth";
import UserMenuDropdown from "./UserMenuDropdown";

export default function NavBar() {
  const repository = Repository.getInstance();
  const { settings, setSettings, showSettings, setShowSettings } =
    useSettingsContext();

  const [user, setUser] = useState<User | null>(repository.getUser() || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(repository.getAuth(), (user) => {
      setUser(user || null);
    });

    return () => unsubscribe();
  }, []);

  //  When the units change, update the current trip.
  useEffect(() => {
    if (repository.trips.currentTrip === null) {
      return;
    }
    repository.trips.update(repository.trips.currentTrip, {
      units: settings.units,
    });
    repository.trips.currentTrip;
  }, [settings]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        top: 0,
        px: 1.5,
        py: 1,
        zIndex: 1000,
        backgroundColor: "background.body",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <IconButton
          size="sm"
          variant="soft"
          onClick={() => setShowSettings(!showSettings)}
        >
          <TuneIcon />
        </IconButton>
        <Typography component="h1" fontWeight="xl">
          TripWeather
        </Typography>
        <img
          width={24}
          height={24}
          src={logo}
          alt="TripWeather Logo - a sun shining"
        />
      </Box>
      <NavigationList />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <UnitsSelect
          units={settings.units}
          onChange={(units) => {
            setSettings({
              ...settings,
              units,
            });
          }}
        />
        <UserMenuDropdown user={user || undefined} />
      </Box>
    </Box>
  );
}
