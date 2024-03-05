import { useEffect, useState } from "react";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { TripLocation } from "../../lib/Location";
import { Suggestion } from "../../../functions/src/location/LocationTypes";
import { AlertDisplayMode, AlertType, useAlertContext } from "../AlertContext";
import { Repository } from "../../lib/repository/Repository";
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
  const [inputValue, setInputValue] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [enableAdd, setEnableAdd] = useState<boolean>(false);

  //  When we have a suggestion selected, enable the 'add' button.
  useEffect(() => {
    setEnableAdd(selectedSuggestion !== null);
  }, [selectedSuggestion]);

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
        displayMode: AlertDisplayMode.Modal,
        title: "Cannot Find Coordinates",
        message: `Unable to find GPS coordinates for ${suggestion.text}, please try a different address or enter GPS coordinates manually.`,
      });
      setSearching(false);
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
        gps: "",
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
    setInputValue("");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        selectLocation(selectedSuggestion);
      }}
    >
      <Stack direction="row" spacing={1}>
        <Autocomplete
          size="lg"
          sx={{ flex: "auto" }}
          placeholder="e.g. Yosemite Valley"
          disabled={searching}
          inputValue={inputValue}
          onInputChange={(event, value) => {
            setInputValue(value);
            if (value === "") {
              return;
            }
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
          isOptionEqualToValue={(option, value) => {
            return option.text === value.text;
          }}
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
          type="submit"
          disabled={!enableAdd}
          onClick={() => selectLocation(selectedSuggestion)}
          loading={searching}
        >
          <ArrowForward />
        </IconButton>
      </Stack>
    </form>
  );
}
