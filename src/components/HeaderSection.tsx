import * as React from "react";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Typography from "@mui/joy/Typography";

export default function AddLifeEvent() {
  return (
    <Stack
      sx={{
        backgroundColor: "background.surface",
        px: { xs: 2, md: 4 },
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack sx={{ mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography level="h4">Add Events</Typography>
        </Stack>
        <Typography level="body-md" color="neutral">
          Visualise and track key life events.
        </Typography>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="Search"
            value={"Melbourne"}
            startDecorator={<SearchRoundedIcon />}
            aria-label="Search"
          />
        </FormControl>
        <Button variant="solid" color="primary">
          Search
        </Button>
      </Stack>
    </Stack>
  );
}
