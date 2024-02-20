import TimelineDot from "@mui/lab/TimelineDot";
import { LifeEvent } from "../../lib/LifeEvent";
import Emoji from "../Emoji";
import { IconButton } from "@mui/material";
import {
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import { useDialogContext } from "../DialogContext";

export enum EventTimelineDotVariant {
  Emoji,
  EmojiDot,
  CategoryColor,
}

interface EventTimelineDotProps {
  variant: EventTimelineDotVariant;
  event: LifeEvent;
}

export default function EventTimelineDot({
  event,
  variant,
}: EventTimelineDotProps) {
  const { setEditEventModalEvent, setDeleteEventModalEvent } =
    useDialogContext();

  /*
      sx={{
        backgroundColor: props.categoryColors[event.category.name], OR "#efefef"
        width: "40px",
        }}
   */

  //  Based on the variant, we'll set a number of styles. Set the style for
  //  EmojiDot first.
  const dotColor = "grey";
  const dotVariant = "outlined";
  const borderColor = "grey";
  const backgroundColor = "#fdfdfd";

  switch (variant) {
    case EventTimelineDotVariant.Emoji:
      break;
    case EventTimelineDotVariant.EmojiDot:
      break;
    case EventTimelineDotVariant.CategoryColor:
      break;
  }

  return (
    <Dropdown>
      <TimelineDot
        color={dotColor}
        variant={dotVariant}
        sx={{
          borderColor,
          backgroundColor,
          padding: 0,
        }}
      >
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: "outlined", color: "neutral" } }}
        >
          <Emoji emoji={event.category.emoji} />
        </MenuButton>
        <Menu>
          <MenuItem onClick={() => setEditEventModalEvent(event)}>
            <ListItemDecorator>
              <EditIcon />
            </ListItemDecorator>{" "}
            Edit Event
          </MenuItem>
          <MenuItem onClick={() => setDeleteEventModalEvent(event)}>
            <ListItemDecorator>
              <DeleteForeverIcon />
            </ListItemDecorator>{" "}
            Delete Event
          </MenuItem>
          <MenuItem>My account</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </TimelineDot>
    </Dropdown>
  );
}
