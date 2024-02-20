import { useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Stack from "@mui/joy/Stack";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import { DialogActions, FormHelperText, Textarea } from "@mui/joy";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { LifelineRepository } from "../lib/LifelineRepository";
import { useAlertContext } from "./AlertContext";
import { LifelineError } from "../lib/Errors";

interface FeedbackModalProps {
  email?: string;
  onClose: (saved: boolean) => void;
}

export default function FeedbackModal(props: FeedbackModalProps) {
  const repository = LifelineRepository.getInstance();
  const { setAlertFromError } = useAlertContext();
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState(props.email || "");
  const [message, setMessage] = useState("");

  const submit = async () => {
    try {
      await repository.saveFeedback({
        subject,
        senderEmail: email,
        message,
      });
    } catch (err) {
      setAlertFromError(LifelineError.fromError("Create Event Error", err));
    }
  };
  return (
    <Modal open={true} onClose={() => props.onClose(false)}>
      <ModalDialog>
        <DialogTitle>Share Feedback</DialogTitle>
        <DialogContent>
          Fill in the form below to share feedback on Lifeline.
        </DialogContent>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            submit();
            props.onClose(true);
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Subject</FormLabel>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sender@email.com"
              />
              <FormHelperText>
                Include your email to be notified when this feedback has been
                addressed!
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea
                minRows={2}
                maxRows={4}
                value={message}
                required
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
          </Stack>
          <DialogActions>
            <Button type="submit" startDecorator={<EmailOutlinedIcon />}>
              Share
            </Button>
            <Button variant="soft" onClick={() => props.onClose(false)}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </ModalDialog>
    </Modal>
  );
}
