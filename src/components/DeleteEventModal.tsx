import { Button, Modal, ModalDialog, Typography } from "@mui/joy";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import { LifeEvent } from "../lib/LifeEvent";

interface DeleteEventModalProps {
  event: LifeEvent;
  onDeleteEvent: (event: LifeEvent) => void;
  onCancel: () => void;
}

export default function DeleteEventModal(props: DeleteEventModalProps) {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={true}
      onClose={() => props.onCancel()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRoundedIcon />
          Confirmation
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{props.event.title}</strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => props.onDeleteEvent(props.event)}
          >
            Delete
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => props.onCancel()}
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
