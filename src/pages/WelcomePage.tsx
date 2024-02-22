import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { functions } from "../lib/app";
import TwoSidedLayout from "../components/TwoSidedLayout";
import { Location } from "../lib/Location";
import {
  FindAddressFromSuggestionRequest,
  FindAddressFromSuggestionResponse,
  SuggestRequest,
  SuggestResponse,
  Suggestion,
} from "../../functions/src/suggest";
import { useAlertContext } from "../components/AlertContext";

export default function WelcomePage() {
  const { setAlertFromError } = useAlertContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const selectLocation = async (suggestion: Suggestion | null) => {
    const findAddress = httpsCallable<
      FindAddressFromSuggestionRequest,
      FindAddressFromSuggestionResponse
    >(functions, "findAddressFromSuggestion");
    if (!suggestion) {
      throw new Error("no suggestion selected");
      //  TODO error context
    }
    const result = await findAddress({
      singleLineAddress: suggestion?.text,
      magicKey: suggestion?.magicKey,
    });

    setLocations([...locations, result.data.candidates[0]]);

    console.log("selected", result);
  };
  const [locations, setLocations] = useState<Location[]>([]);

  return (
    <TwoSidedLayout reversed>
      <Chip size="lg" variant="outlined" color="neutral">
        The power to do more
      </Chip>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        Get the perfect conditions for your next adventure
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        Check weather from multiple providers and share with your friends to
        plan the perfect trip.
      </Typography>
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
            const addMessage = httpsCallable<SuggestRequest, SuggestResponse>(
              functions,
              "arcGisSuggest",
            );
            addMessage({ location: value })
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
        {selectedSuggestion !== null && (
          <Typography>{selectedSuggestion.text}</Typography>
        )}
      </Box>
      <List>
        {locations.map((location) => (
          <ListItem key={location.address}>
            <ListItemButton>
              <ListItemDecorator>
                <HomeIcon />
              </ListItemDecorator>
              <ListItemContent>{location.address}</ListItemContent>
              <KeyboardArrowRightIcon />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </TwoSidedLayout>
  );
}
