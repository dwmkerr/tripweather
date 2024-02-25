import { useState } from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";
import Grid from "@mui/joy/Grid";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import {
  AddressSearchStatus,
  DateWeather,
  TripLocation,
  WeatherStatus,
} from "../lib/Location";
import { Suggestion } from "../../functions/src/arcgis";
import { useAlertContext } from "../components/AlertContext";
import { Repository } from "../lib/Repository";
import { FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import { getMidnightDates } from "../lib/Time";

export interface SearchBarProps {
  onSelectLocation: (location: TripLocation) => void;
}

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
  const repository = Repository.getInstance();
  const { settings, setSettings } = useSettingsContext();

  const { setAlertFromError } = useAlertContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const selectLocation = async (suggestion: Suggestion | null) => {
    if (!suggestion) {
      throw new Error("no suggestion selected");
      //  TODO error context
    }
    //  Add a new trip location, and then start the search for it's candidate
    //  addresses.
    const dates = getMidnightDates(settings.startDate, settings.endDate);
    const location: TripLocation = {
      id: crypto.randomUUID(),
      originalSearch: {
        address: suggestion.text,
        magicKey: suggestion.magicKey,
      },
      addressSearchStatus: AddressSearchStatus.NotStarted,
      datesWeather: dates.map(
        (date): DateWeather => ({
          date,
          weatherStatus: WeatherStatus.Loading,
        }),
      ),
    };
    onSelectLocation(location);
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        gap: 1,
        my: 2,
        alignSelf: "stretch",
        flexBasis: "80%",
      }}
    >
      <Autocomplete
        size="lg"
        sx={{ flex: "auto" }}
        placeholder="e.g. Yosemite Valley"
        onInputChange={(event, value) => {
          repository.functions
            .suggest({ location: value })
            .then((result) => {
              const { suggestions } = result.data;
              setSuggestions(suggestions);
              console.log(suggestions);
            })
            .catch(setAlertFromError);
        }}
        onChange={(event, value) => {
          setSelectedSuggestion(value);
        }}
        options={suggestions}
        getOptionLabel={(option) => option.text}
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option.text, inputValue);
          const parts = parse(option.text, matches);

          return (
            <AutocompleteOption {...props}>
              <Typography level="inherit">
                {option.text === inputValue
                  ? option.text
                  : parts.map((part, index) => (
                      <Typography
                        key={index}
                        {...(part.highlight && {
                          variant: "soft",
                          color: "primary",
                          fontWeight: "lg",
                          px: "2px",
                        })}
                      >
                        {part.text}
                      </Typography>
                    ))}
              </Typography>
            </AutocompleteOption>
          );
        }}
      />
      <IconButton
        size="lg"
        variant="solid"
        color="primary"
        onClick={() => selectLocation(selectedSuggestion)}
      >
        <ArrowForward />
      </IconButton>
      <Stack direction="row" useFlexGap spacing={3}>
        <FormControl orientation="horizontal">
          <FormLabel sx={{ typography: "body-sm" }}>From</FormLabel>
          <Input
            id="start-date"
            type="date"
            aria-label="Date"
            value={settings.startDate.toISOString().substring(0, 10) || ""}
            onChange={(e) => {
              setSettings({
                ...settings,
                startDate: new Date(e.target.value),
              });
            }}
          />
        </FormControl>
        <FormControl orientation="horizontal">
          <FormLabel sx={{ typography: "body-sm" }}>To</FormLabel>
          <Input
            id="end-date"
            type="date"
            aria-label="Date"
            value={settings.endDate?.toISOString().substring(0, 10) || ""}
            onChange={(e) => {
              setSettings({
                ...settings,
                endDate: new Date(e.target.value),
              });
            }}
          />
        </FormControl>
      </Stack>
    </Box>
  );
}
