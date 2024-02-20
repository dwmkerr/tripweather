import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { functions } from "../lib/app";
import TwoSidedLayout from "../components/TwoSidedLayout";
import {
  SuggestRequest,
  SuggestResponse,
  Suggestion,
} from "../../functions/src/suggest";

export default function WelcomePage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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
          placeholder="Type a movie name"
          onInputChange={(event, value) => {
            const addMessage = httpsCallable<SuggestRequest, SuggestResponse>(
              functions,
              "arcGisSuggest",
            );
            addMessage({ location: value }).then((result) => {
              // Read result of the Cloud Function.
              /** @type {any} */
              const data = result.data;
              const suggestions = data.suggestions;
              setSuggestions(suggestions);
              console.log(suggestions);
            });
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
        <IconButton type="submit" size="lg" variant="solid" color="primary">
          <ArrowForward />
        </IconButton>
      </Box>
    </TwoSidedLayout>
  );
}
