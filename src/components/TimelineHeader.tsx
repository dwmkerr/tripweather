import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";

import AddIcon from "@mui/icons-material/Add";

import OrderSelector, { OrderSelectorProps } from "./OrderSelector";
import { useDialogContext } from "./DialogContext";

export type TimelineHeaderProps = OrderSelectorProps;

export default function TimelineHeader(props: TimelineHeaderProps) {
  const { setShowAddEventDialog } = useDialogContext();

  return (
    <Stack
      useFlexGap
      direction="row"
      spacing={{ xs: 0, sm: 2 }}
      justifyContent={{ xs: "space-between" }}
      flexWrap="wrap"
      sx={{ minWidth: 0 }}
    >
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<AddIcon />}
        onClick={() => setShowAddEventDialog(true)}
      >
        Add...
      </Button>
      <OrderSelector {...props} />
    </Stack>
  );
}
