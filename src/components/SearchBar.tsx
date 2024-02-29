import { useState } from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { TripLocation } from "../lib/Location";
import { Suggestion } from "../../functions/src/arcgis";
import { AlertType, useAlertContext } from "../components/AlertContext";
import { Repository } from "../lib/Repository";
import { FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { useSettingsContext } from "../contexts/SettingsContextProvider";

export interface SearchBarProps {
  onSelectLocation: (location: TripLocation) => void;
}

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
  const repository = Repository.getInstance();
  const { settings, setSettings } = useSettingsContext();

  const { setAlertInfo, setAlertFromError } = useAlertContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [searchingForCoordinates, setSearchingForCoordinates] =
    useState<boolean>(false);

  const selectLocation = async (suggestion: Suggestion | null) => {
    if (!suggestion) {
      throw new Error("no suggestion selected");
      //  TODO error context
    }
    setSearchingForCoordinates(true);

    //  Find the location candidates.
    const address = await repository.functions.findAddress({
      singleLineAddress: suggestion.text,
      magicKey: suggestion.magicKey,
    });

    //  If we have no candidates, warn and bail.
    if (address.data.candidates.length === 0) {
      setAlertInfo({
        type: AlertType.Warning,
        title: "Cannot Find Coordinates",
        message: `Unable to find GPS coordinates for ${suggestion.text}, please try a different address or enter GPS coordinates manually.`,
      });
      setSearchingForCoordinates(false);
      setSelectedSuggestion(null);
      return;
    }

    const buildLabel = (address: string) => {
      //  If we have a comma, assume anything following it is the address.
      const commaLocation = address.indexOf(",");
      return address.substring(0, commaLocation);
    };

    //  Add a new trip location, and then start the search for it's candidate
    //  addresses.
    const location: TripLocation = {
      id: crypto.randomUUID(),
      label: buildLabel(suggestion.text),
      originalSearch: {
        address: suggestion.text,
        magicKey: suggestion.magicKey,
      },
      location: {
        address: address.data.candidates[0].address,
        latitude: address.data.candidates[0].location.x,
        longitude: address.data.candidates[0].location.y,
      },
      datesWeather: [],
    };
    setSearchingForCoordinates(false);
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
        disabled={searchingForCoordinates}
        onInputChange={(event, value) => {
          repository.functions
            .suggest({ location: value })
            .then((result) => {
              const { suggestions } = result.data;
              setSuggestions(suggestions);
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
        loading={searchingForCoordinates}
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
