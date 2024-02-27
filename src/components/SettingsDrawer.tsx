import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Drawer from "@mui/joy/Drawer";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import { IconButton, Radio, RadioGroup, Tooltip, Typography } from "@mui/joy";

import ClearIcon from "@mui/icons-material/Clear";

import { useSettingsContext } from "../contexts/SettingsContextProvider";

export default function SettingsDrawer() {
  const { showSettings, setShowSettings, settings, setSettings } =
    useSettingsContext();

  return (
    <Stack
      useFlexGap
      direction="row"
      spacing={{ xs: 0, sm: 2 }}
      justifyContent={{ xs: "space-between" }}
      flexWrap="wrap"
      sx={{ minWidth: 0 }}
    >
      <Drawer open={showSettings} onClose={() => setShowSettings(false)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: 0,
            right: 0,
            gap: 0.5,
            ml: "auto",
            mr: 1.5,
            mt: 1.5,
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            fontSize="sm"
            fontWeight="lg"
            sx={{ cursor: "pointer" }}
          >
            Close
          </Typography>
          <ModalClose id="close-icon" sx={{ position: "initial" }} />
        </Box>
        <Stack useFlexGap spacing={3} sx={{ p: 2 }}>
          <DialogTitle>Settings</DialogTitle>
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              Unit Presets
            </FormLabel>
            <RadioGroup defaultValue="outlined" name="radio-buttons-group">
              <Tooltip title="CA units" placement="left-start">
                <Radio value="ca" label="C˚, km/h" />
              </Tooltip>
              <Radio value="us" label="F˚, mph" />
              <Radio value="uk" label="C˚, mph" />
              <Radio value="si" label="C˚, m/s" />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              Start Date
            </FormLabel>
            <Input
              id="filters-start-date"
              type="date"
              aria-label="Date"
              endDecorator={
                <IconButton variant="plain" size="sm">
                  <ClearIcon />
                </IconButton>
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              End Date
            </FormLabel>
            <Input
              id="filters-end-date"
              type="date"
              aria-label="Date"
              endDecorator={
                <IconButton variant="plain" size="sm">
                  <ClearIcon />
                </IconButton>
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              Events
            </FormLabel>
            <Checkbox label="Show Minor Events" />
          </FormControl>
        </Stack>
      </Drawer>
    </Stack>
  );
}
