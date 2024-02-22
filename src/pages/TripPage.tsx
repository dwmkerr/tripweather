import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";
import Grid from "@mui/joy/Grid";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import PlaceIcon from "@mui/icons-material/Place";

import { AddressSearchStatus, TripLocation } from "../lib/Location";
import { Suggestion } from "../../functions/src/suggest";
import { useAlertContext } from "../components/AlertContext";
import { Repository } from "../lib/Repository";
import TripLocationListItem from "../components/TripLocationListItem";

export default function TripPage() {
  const repository = Repository.getInstance();

  const { setAlertFromError } = useAlertContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [locations, setLocations] = useState<TripLocation[]>([]);
  const selectLocation = async (suggestion: Suggestion | null) => {
    if (!suggestion) {
      throw new Error("no suggestion selected");
      //  TODO error context
    }
    //  Add a new trip location, and then start the search for it's candidate
    //  addresses.
    const location: TripLocation = {
      id: crypto.randomUUID(),
      originalSearch: {
        address: suggestion.text,
        magicKey: suggestion.magicKey,
      },
      addressSearchStatus: AddressSearchStatus.NotStarted,
    };
    setLocations([...locations, location]);

    //  Now that we've added the location, start to hydrate it.
    const result = await repository.functions.findAddress({
      singleLineAddress: location.originalSearch.address,
      magicKey: location.originalSearch.magicKey,
    });
    setLocations((previousLocations) => {
      return previousLocations.map((l) => {
        if (l.id !== location.id) {
          return l;
        }
        return {
          ...l,
          addressSearchStatus: AddressSearchStatus.Complete,
          candidate: result.data.candidates[0],
        };
      });
    });
  };

  useEffect(() => {
    // const search = async () => {
    //   //  Check to see if any locations need an address search.
    //   locations.forEach(async (location) => {
    //     const searchingLocation = {
    //       ...location,
    //       addressSearchStatus: AddressSearchStatus.InProgress,
    //     };
    //     setLocations([...locations, searchingLocation]);
    //     const result = await repository.functions.findAddress({
    //       singleLineAddress: location.originalSearch.address,
    //       magicKey: location.originalSearch.magicKey,
    //     });
    //     const searchedLocation = {
    //       ...location,
    //       candidate: result.data.candidates[0],
    //       addressSearchStatus: AddressSearchStatus.Complete,
    //     };
    //     setLocations([...locations, searchedLocation]);
    //   });
    // };
    // search();
  }, [locations]);

  return (
    <Grid
      spacing={2}
      sx={{
        flexGrow: 1,
        maxWidth: 1024,
        marginLeft: "auto",
        marginRight: "auto",
        paddingTop: 2,
      }}
    >
      <Grid xs={12}>
        <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
          Start by searching for a location or adding a GPS coordinate, then add
          as many other locations to compare as you like!
        </Typography>
      </Grid>
      <Grid xs={12}>
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
        </Box>
      </Grid>
      <Grid xs={12}>
        <List>
          {locations.map((location) => (
            <TripLocationListItem location={location} />
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
