import { useEffect, useState } from "react";
import { Box, Button, IconButton, Input } from "@mui/joy";
import Typography from "@mui/joy/Typography";

import TuneIcon from "@mui/icons-material/TuneRounded";
import ClearIcon from "@mui/icons-material/Clear";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

import UserMenuDropdown from "./UserMenuDropdown";
import { LifelineRepository } from "../lib/LifelineRepository";
import { User, onAuthStateChanged } from "firebase/auth";
import { useDialogContext } from "./DialogContext";

export interface NavBarProps {
  searchText: string;
  onSearchTextChanged: (searchText: string) => void;
}

export default function NavBar(props: NavBarProps) {
  const repository = LifelineRepository.getInstance();
  const { showFilters, setShowFilters, setShowFeedbackDialog } =
    useDialogContext();
  const [user, setUser] = useState<User | null>(repository.getUser() || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(repository.getAuth(), (user) => {
      setUser(user || null);
    });

    return () => unsubscribe();
  }, []);
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
          onClick={() => setShowFilters(!showFilters)}
        >
          <TuneIcon />
        </IconButton>
        <Typography component="h1" fontWeight="xl">
          Lifeline
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Input
          size="sm"
          variant="outlined"
          placeholder="Search events..."
          value={props.searchText}
          onChange={(e) => {
            props.onSearchTextChanged(e.target.value);
          }}
          startDecorator={<SearchRoundedIcon color="primary" />}
          endDecorator={
            <IconButton
              variant="plain"
              size="sm"
              onClick={() => {
                props.onSearchTextChanged("");
              }}
            >
              <ClearIcon />
            </IconButton>
          }
          sx={{
            alignSelf: "center",
            display: {
              xs: "none",
              sm: "flex",
            },
            width: "480px",
          }}
        />
        <Button
          startDecorator={<LightbulbOutlinedIcon />}
          onClick={() => setShowFeedbackDialog(true)}
        >
          Share Feedback
        </Button>
        <UserMenuDropdown user={user || undefined} />
      </Box>
    </Box>
  );
}
