import { useEffect, useRef, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";

import { LifeEvent, EventCategory } from "../lib/LifeEvent";
import { Checkbox, Textarea } from "@mui/joy";
import { LifelineRepository } from "../lib/LifelineRepository";
import { useAlertContext } from "./AlertContext";
import { LifelineError } from "../lib/Errors";
import CategorySelect from "./CategorySelect";

export enum AddEditEventMode {
  Add,
  Edit,
}

interface AddEditEventModalProps {
  mode: AddEditEventMode;
  event?: LifeEvent;
  cateories: EventCategory[];
  onClose: (saved: boolean) => void;
}

export default function AddEditEventModal(props: AddEditEventModalProps) {
  const repository = LifelineRepository.getInstance();
  const { setAlertFromError } = useAlertContext();

  const [title, setTitle] = useState(props.event?.title || "");
  const [category, setCategory] = useState<EventCategory>(
    props.event?.category || { emoji: "", name: "" },
  );
  const [year, setYear] = useState(props.event?.year || null);
  const [month, setMonth] = useState(props.event?.month || null);
  const [day, setDay] = useState(props.event?.day || null);
  const [notes, setNotes] = useState(props.event?.notes || null);
  const [minor, setMinor] = useState(props.event?.minor || false);

  //  Focus the title on mount.
  //  Kludgy - can't get 'autoFocus' to work and 'useCallback' didn't work either.
  const titleRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      titleRef?.current?.focus();
    }, 100);
  }, []);

  const submit = async () => {
    if (year === null) {
      setAlertFromError(
        new LifelineError(
          "Save Error",
          "Cannot save an event if a year is not set",
        ),
      );
      return;
    }
    if (props.mode === AddEditEventMode.Add) {
      try {
        await repository.create({
          title,
          category,
          year,
          month,
          day,
          notes,
          minor,
        });
      } catch (err) {
        setAlertFromError(LifelineError.fromError("Create Event Error", err));
      }
    } else {
      if (props.event === undefined) {
        setAlertFromError(
          new LifelineError(
            "Save Error",
            "Cannot save an event if the event has not been provided",
          ),
        );
        return;
      }
      try {
        await repository.save({
          ...props.event,
          title,
          category,
          year,
          month,
          day,
          notes,
          minor,
        });
      } catch (err) {
        setAlertFromError(LifelineError.fromError("Save Event Error", err));
      }
    }
  };
  return (
    <Modal open={true} onClose={() => props.onClose(false)}>
      <ModalDialog>
        <DialogTitle>
          {props.mode === AddEditEventMode.Add ? "Add Event" : "Edit Event"}
        </DialogTitle>
        <DialogContent>Fill in the details of the event.</DialogContent>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            submit();
            props.onClose(true);
          }}
        >
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              slotProps={{ input: { ref: titleRef } }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </FormControl>
          <Stack spacing={2}>
            <FormLabel>Date</FormLabel>
            <Stack direction="row" spacing={1}>
              <FormControl sx={{ flex: 1, maxWidth: 80 }}>
                <Input
                  placeholder="1995"
                  aria-label="Year"
                  value={year || ""}
                  onChange={(e) => setYear(Number.parseInt(e.target.value))}
                  required
                />
              </FormControl>
              <FormControl sx={{ flex: 1, maxWidth: 80 }}>
                <Input
                  placeholder="03"
                  aria-label="Month"
                  value={month || ""}
                  onChange={(e) => setMonth(Number.parseInt(e.target.value))}
                />
              </FormControl>
              <FormControl sx={{ flex: 1, maxWidth: 80 }}>
                <Input
                  placeholder="14"
                  aria-label="Day"
                  value={day || ""}
                  onChange={(e) => setDay(Number.parseInt(e.target.value))}
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <CategorySelect
                category={category}
                categories={props.cateories}
                onChange={(category) => {
                  setCategory(category);
                  console.log("category", category);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea
                minRows={2}
                maxRows={4}
                value={notes || ""}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Checkbox
                label="Minor"
                checked={minor}
                onChange={(event) => setMinor(event.target.checked)}
              />
            </FormControl>
            {props.mode === AddEditEventMode.Add ? (
              <Button type="submit">Add</Button>
            ) : (
              <Button type="submit">Save</Button>
            )}
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
