import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteOption,
  IconButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import EmojiPicker from "emoji-picker-react";

import EditNoteIcon from "@mui/icons-material/EditNote";

import { EventCategory } from "../lib/LifeEvent";
import { useDialogContext } from "./DialogContext";
import Emoji from "./Emoji";

export interface CategorySelectProps {
  category: EventCategory;
  onChange?: (category: EventCategory) => void;
  categories: EventCategory[];
  showEditOption?: boolean;
}

export const EmojiButton = ({
  emoji,
  onClick,
}: {
  emoji: string;
  onClick: () => void;
}) => (
  <IconButton
    variant={emoji === "" ? "soft" : "plain"}
    color="neutral"
    onClick={onClick}
  >
    <Emoji emoji={emoji} />
  </IconButton>
);

export default function CategorySelect(props: CategorySelectProps) {
  const { setShowCategoriesDialog } = useDialogContext();
  const [emoji, setEmoji] = useState(props.category.emoji);
  const [name, setName] = useState(props.category.name);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState(props.categories);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(
    props.categories.find(
      (ec) =>
        ec.emoji === props.category.emoji && ec.name === props.category.name,
    ) || { emoji: "", name: "" },
  );

  useEffect(() => {
    props.onChange?.({ emoji, name });
  }, [emoji, name]);

  useEffect(() => {
    let categories = [...props.categories];
    if (!categories.find((nc) => nc.emoji === emoji && nc.name === name)) {
      categories = [{ emoji, name }, ...categories];
      setCategories(categories);
    }
  }, [emoji, name]);

  /*return (
    <React.Fragment>
      <EmojiPicker
        open={emojiPickerOpen}
        onEmojiClick={(newEmoji) => {
          setEmoji(newEmoji.emoji);
          setEmojiPickerOpen(false);

          //  Remove the old value and add the new value for the categories.
          let newCategories = [...categories];
          const lastFullValue = `${emoji}${name}`;
          const newFullValue = `${newEmoji.emoji}${name}`;
          if (props.categories.indexOf(lastFullValue) === -1) {
            newCategories = categories.filter((c) => c !== lastFullValue);
          }
          if (categories.indexOf(newFullValue) === -1) {
            newCategories = [...newCategories, newFullValue];
          }
          setCategories(newCategories);
        }}
      />
      <Autocomplete
        startDecorator={
          <EmojiButton emoji={emoji} onClick={() => setEmojiPickerOpen(true)} />
        }
        value={selectedCategory}
        options={categories}
        onChange={(e, value) => {
          const { emoji, name } = CategoryColor.toEmojiAndName(value || "");
          setEmoji(emoji);
          setName(name);
        }}
        onInputChange={(e, value) => {
          let newCategories = [...categories];
          const fullValue = `${emoji}${value}`;

          //  If the previous value was not in the original set of categories,
          //  remove it. This is so that typing "Name" doesn't create the
          //  categories ["N", "Na", "Nam"].
          if (props.categories.indexOf(fullValue) === -1) {
            newCategories = categories.filter((c) => c !== fullValue);
          }

          //  If the categories don't include "Name", add it.
          if (categories.indexOf(value) === -1) {
            newCategories = [...newCategories, fullValue];
          }
          //  Set the name and categories.
          const emojiAndName = CategoryColor.toEmojiAndName(value);
          setEmoji(emojiAndName.emoji);
          setName(emojiAndName.name);
          setCategories(newCategories);
        }}
        renderOption={(props, option) => {
          return (
            <AutocompleteOption {...props}>
              <ListItemDecorator>
                <Emoji emoji={option.emoji} />
              </ListItemDecorator>
              <ListItemContent sx={{ marginLeft: -1 }}>
                {option.name}
              </ListItemContent>
            </AutocompleteOption>
          );
        }}
      />
    </React.Fragment>
  );

*/
  return (
    <React.Fragment>
      <EmojiPicker
        open={emojiPickerOpen}
        onEmojiClick={(newEmoji) => {
          setEmoji(newEmoji.emoji);
          setEmojiPickerOpen(false);
        }}
      />
      <Autocomplete
        startDecorator={
          <EmojiButton emoji={emoji} onClick={() => setEmojiPickerOpen(true)} />
        }
        endDecorator={
          props.showEditOption === true && (
            <IconButton
              variant="plain"
              onClick={() => setShowCategoriesDialog(true)}
            >
              <EditNoteIcon />
            </IconButton>
          )
        }
        value={selectedCategory}
        options={categories}
        autoSelect={true}
        onChange={(e, value) => {
          console.log("onChange", value);
          setEmoji(value?.emoji || "");
          setName(value?.name || "");
        }}
        onInputChange={(e, value) => {
          //  Updating the currently editing category.
          //  Set the name and categories.
          console.log("onInputChange", value);
          setName(value);
          setSelectedCategory({ emoji, name: value });
        }}
        isOptionEqualToValue={(option, value) => {
          return option.emoji === value.emoji && option.name === value.name;
        }}
        getOptionKey={(option) => `${option.emoji}${option.name}`}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => {
          return (
            <AutocompleteOption {...props}>
              <ListItemDecorator>
                <Emoji emoji={option.emoji} />
              </ListItemDecorator>
              <ListItemContent sx={{ marginLeft: -1 }}>
                {option.name}
              </ListItemContent>
            </AutocompleteOption>
          );
        }}
      />
    </React.Fragment>
  );
}
