import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { Typography } from "@mui/joy";

export interface EmojiProps {
  emoji: string;
}

export default function Emoji({ emoji }: EmojiProps) {
  return emoji === "" ? (
    <SentimentSatisfiedIcon sx={{ color: "#ababab" }} />
  ) : (
    <Typography fontSize="xl" sx={{ marginTop: "-5px", marginBottom: "-5px" }}>
      {emoji}
    </Typography>
  );
}
