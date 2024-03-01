import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import { User } from "firebase/auth";

export interface RequireLoginDialogProps {
  onClose: (user: User | null) => void;
}

export default function RequireLoginDialog(props: RequireLoginDialogProps) {
  return (
    <Modal open={true} onClose={() => props.onClose(null)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRoundedIcon />
          Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
          Are you sure you want to discard all of your notes?
        </DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => props.onClose(null)}
          >
            Discard notes
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => props.onClose(null)}
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
