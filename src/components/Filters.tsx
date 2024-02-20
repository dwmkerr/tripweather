import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Checkbox from "@mui/joy/Checkbox";
import Drawer from "@mui/joy/Drawer";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import { IconButton, Link, ListItemDecorator, Typography } from "@mui/joy";

import ClearIcon from "@mui/icons-material/Clear";

import { useDialogContext } from "./DialogContext";
import {
  EventCategory,
  LifeEvent,
  ecContains,
  ecEquals,
  ecToString,
  ecUnique,
} from "../lib/LifeEvent";
import { useRef } from "react";
import Emoji from "./Emoji";

export type FilterSettings = {
  selectedCategories: EventCategory[];
  includeMinor: boolean;
  startDate?: Date;
  endDate?: Date;
};

export type FiltersProps = {
  categories: EventCategory[];
  categoryColors: Record<string, string>;
  filterSettings: FilterSettings;
  onChangeFilterSettings: (filterSettings: FilterSettings) => void;
};

export function applyFilters(
  events: LifeEvent[],
  filters: FilterSettings,
  searchText: string,
): LifeEvent[] {
  const matchSearch = (val: string) =>
    val.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  return events.filter((event) => {
    const eventDate = new Date(
      event.year,
      event.month ? event.month - 1 : 0,
      event.day ? event.day : 1,
    );
    const categoryMatch =
      filters.selectedCategories.find(
        (sc) =>
          sc.emoji === event.category.emoji && sc.name === event.category.name,
      ) !== undefined;
    const searchMatch =
      searchText === "" ||
      matchSearch(event.title) ||
      matchSearch(event.notes || "");
    const minorMatch = filters.includeMinor || event.minor === false;
    const matchStartDate = filters.startDate
      ? eventDate.getTime() >= filters.startDate.getTime()
      : true;
    const matchEndDate = filters.endDate
      ? eventDate.getTime() <= filters.endDate.getTime()
      : true;
    return (
      categoryMatch &&
      searchMatch &&
      minorMatch &&
      matchStartDate &&
      matchEndDate
    );
  });
}

export default function Filters(props: FiltersProps) {
  const { showFilters, setShowFilters } = useDialogContext();

  //  We track whether the user has ever changed their categories.
  const categoriesChangedRef = useRef(false);

  const selectAll = () => {
    props.onChangeFilterSettings({
      ...props.filterSettings,
      selectedCategories: [...props.categories],
    });
  };

  const selectNone = () => {
    props.onChangeFilterSettings({
      ...props.filterSettings,
      selectedCategories: [],
    });
  };

  return (
    <Stack
      useFlexGap
      direction="row"
      spacing={{ xs: 0, sm: 2 }}
      justifyContent={{ xs: "space-between" }}
      flexWrap="wrap"
      sx={{ minWidth: 0 }}
    >
      <Drawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        hideBackdrop={true}
      >
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
          <DialogTitle>Filters</DialogTitle>
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              Start Date
            </FormLabel>
            <Input
              id="filters-start-date"
              type="date"
              aria-label="Date"
              value={
                props.filterSettings.startDate
                  ?.toISOString()
                  .substring(0, 10) || ""
              }
              onChange={(e) => {
                props.onChangeFilterSettings({
                  ...props.filterSettings,
                  startDate: new Date(e.target.value),
                });
              }}
              endDecorator={
                <IconButton
                  variant="plain"
                  size="sm"
                  onClick={() => {
                    props.onChangeFilterSettings({
                      ...props.filterSettings,
                      startDate: undefined,
                    });
                  }}
                >
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
              value={
                props.filterSettings.endDate?.toISOString().substring(0, 10) ||
                ""
              }
              onChange={(e) => {
                props.onChangeFilterSettings({
                  ...props.filterSettings,
                  endDate: new Date(e.target.value),
                });
              }}
              endDecorator={
                <IconButton
                  variant="plain"
                  size="sm"
                  onClick={() => {
                    props.onChangeFilterSettings({
                      ...props.filterSettings,
                      endDate: undefined,
                    });
                  }}
                >
                  <ClearIcon />
                </IconButton>
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              Events
            </FormLabel>
            <Checkbox
              label="Show Minor Events"
              checked={props.filterSettings.includeMinor}
              onChange={(event) => {
                props.onChangeFilterSettings({
                  ...props.filterSettings,
                  includeMinor: event.target.checked,
                });
              }}
            />
          </FormControl>
          <Stack>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              Category
            </FormLabel>
            <Typography sx={{ typography: "body-sm" }}>
              <Link onClick={() => selectAll()}>Select All</Link> |{" "}
              <Link onClick={() => selectNone()}>Select None</Link>
            </Typography>
            <List
              orientation="horizontal"
              wrap
              sx={{
                "--List-gap": "8px",
                "--ListItem-radius": "20px",
                paddingTop: 1,
              }}
            >
              {props.categories.map((category) => {
                const selected = ecContains(
                  props.filterSettings.selectedCategories,
                  category,
                );
                return (
                  <ListItem key={ecToString(category)}>
                    <ListItemDecorator
                      sx={{
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      <Typography sx={{ mr: "auto" }}>
                        <Emoji emoji={category.emoji} />
                      </Typography>
                    </ListItemDecorator>
                    <Checkbox
                      size="sm"
                      overlay
                      disableIcon
                      variant="soft"
                      label={category.name || "(No Category)"}
                      checked={selected}
                      onChange={(event) => {
                        categoriesChangedRef.current = true;
                        const newCategories = event.target.checked
                          ? ecUnique([
                              ...props.filterSettings.selectedCategories,
                              category,
                            ])
                          : ecUnique(
                              props.filterSettings.selectedCategories.filter(
                                (sc) => !ecEquals(sc, category),
                              ),
                            );
                        props.onChangeFilterSettings({
                          ...props.filterSettings,
                          selectedCategories: newCategories,
                        });
                      }}
                      slotProps={{
                        action: ({ checked }) => ({
                          sx: checked
                            ? {
                                border: "1px solid",
                                borderColor: "primary.500",
                              }
                            : {},
                        }),
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
}
