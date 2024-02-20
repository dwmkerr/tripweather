import { useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

import { LifelineRepository } from "../lib/LifelineRepository";
import { useAlertContext } from "./AlertContext";
import { LifelineError } from "../lib/Errors";
import { UserSettings } from "../lib/UserSettings";
import { Checkbox, DialogActions, Stack } from "@mui/joy";

interface UserSettingsModalProps {
  userSettings: UserSettings;
  onClose: (saved: boolean) => void;
}

export default function UserSettingsModal(props: UserSettingsModalProps) {
  const repository = LifelineRepository.getInstance();
  const { setAlertFromError } = useAlertContext();

  const [dob, setDob] = useState<Date | undefined>(
    props.userSettings.dateOfBirth,
  );
  const [showAgeOnTimeline, setShowAgeOnTimeline] = useState<boolean>(
    props.userSettings.showAgeOnTimeline,
  );

  const submit = () => {
    try {
      repository.saveUserSettings({
        ...props.userSettings,
        dateOfBirth: dob,
        showAgeOnTimeline,
      });
    } catch (err) {
      setAlertFromError(LifelineError.fromError("Save Event Error", err));
    }
  };
  return (
    <Modal open={true} onClose={() => props.onClose(false)}>
      <ModalDialog>
        <DialogTitle>User Settings</DialogTitle>
        <DialogContent>Configure your user settings.</DialogContent>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            submit();
            props.onClose(true);
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel htmlFor="dob">Date of Birth</FormLabel>
              <Input
                id="dob"
                placeholder="1995-01-01"
                aria-label="Date of Birth"
                type="date"
                value={dob?.toISOString().substring(0, 10) || ""}
                onChange={(e) => setDob(new Date(e.target.value))}
              />
            </FormControl>
            <FormControl>
              <Checkbox
                label="Show Age on Timeline"
                checked={showAgeOnTimeline}
                onChange={(event) => setShowAgeOnTimeline(event.target.checked)}
              />
            </FormControl>
          </Stack>

          <DialogActions>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </ModalDialog>
    </Modal>
  );
}
