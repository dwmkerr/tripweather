import { useState } from "react";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { TripLocation } from "../../lib/Location";
import { Suggestion } from "../../../functions/src/location/LocationTypes";
import { AlertType, useAlertContext } from "../AlertContext";
import { Repository } from "../../lib/Repository";
import { Stack } from "@mui/joy";
import { TripWeatherError } from "../../lib/Errors";

export interface AddressSearchInputProps {
  onSelectLocation: (location: TripLocation) => void;
}

export default function AddressSearchInput({
  onSelectLocation,
}: AddressSearchInputProps) {
  const repository = Repository.getInstance();

  const { setAlertInfo, setAlertFromError } = useAlertContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [searching, setSearching] = useState<boolean>(false);

  const selectLocation = async (suggestion: Suggestion | null) => {
    if (!suggestion) {
      setAlertFromError(
        new TripWeatherError("Address Search Error", "No address selected"),
      );
      return;
    }
    setSearching(true);

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
      setSearching(false);
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
    setSearching(false);
    onSelectLocation(location);
  };

  return (
    <Stack direction="row" spacing={1}>
      <Autocomplete
        size="lg"
        sx={{ flex: "auto" }}
        placeholder="e.g. Yosemite Valley"
        disabled={searching}
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
        loading={searching}
      >
        <ArrowForward />
      </IconButton>
    </Stack>
  );
}