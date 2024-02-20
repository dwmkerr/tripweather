import React, { useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

import {
  DialogActions,
  List,
  ListItem,
  ListItemDecorator,
  Stack,
} from "@mui/joy";
import { EventCategory, ecToString } from "../lib/LifeEvent";
import { EmojiButton } from "./CategorySelect";
import EmojiPicker from "emoji-picker-react";
import Emoji from "./Emoji";

interface CategoriesModalProps {
  categories: EventCategory[];
  onChange?: (categories: EventCategory[]) => void;
  onClose: (saved: boolean) => void;
}

export default function CatgoriesModal(props: CategoriesModalProps) {
  const [emoji, setEmoji] = useState("");
  const [name, setName] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  // const submit = () => {
  //   try {
  //     repository.saveUserSettings({
  //       ...props.userSettings,
  //       dateOfBirth: dob,
  //       showAgeOnTimeline,
  //     });
  //   } catch (err) {
  //     setAlertFromError(LifelineError.fromError("Save Event Error", err));
  //   }
  // };
  return (
    <React.Fragment>
      <Modal open={true} onClose={() => props.onClose(false)}>
        <ModalDialog>
          <DialogTitle>Categories</DialogTitle>
          <DialogContent>Configure your categories.</DialogContent>
          <List>
            {props.categories.map((category) => (
              <ListItem key={ecToString(category)}>
                <ListItemDecorator>
                  <Emoji emoji={category.emoji} />
                </ListItemDecorator>
                {category.name}
              </ListItem>
            ))}
          </List>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Add Category</FormLabel>
              <Stack direction="row" justifyContent="space-between">
                <EmojiButton
                  emoji={emoji}
                  onClick={() => setEmojiPickerOpen(true)}
                />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category Name"
                />
              </Stack>
            </FormControl>
            <EmojiPicker
              open={emojiPickerOpen}
              onEmojiClick={(newEmoji) => {
                setEmoji(newEmoji.emoji);
                setEmojiPickerOpen(false);
              }}
            />
          </Stack>

          <DialogActions>
            <Button type="submit">Save</Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
