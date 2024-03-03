import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

import CloseIcon from "@mui/icons-material/Close";

import {
  AlertAction,
  AlertDisplayMode,
  AlertInfo,
  alertTypeToColor,
  alertTypeToIcon,
} from "./AlertContext";

interface AlertDisplayProps {
  alertInfo?: AlertInfo;
  onDismiss: () => void;
}

interface AlertSnackbarProps {
  alertInfo: AlertInfo;
  onDismiss: () => void;
}

interface AlertDialogProps {
  alertInfo: AlertInfo;
  onDismiss: () => void;
}

function AlertSnackbar({ alertInfo, onDismiss }: AlertSnackbarProps) {
  const [open, setOpen] = useState(!!alertInfo);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setOpen(!!alertInfo);
  }, [alertInfo]);

  const dismiss = () => {
    setOpen(false);
    onDismiss();
  };

  const color = alertInfo ? alertTypeToColor(alertInfo?.type) : "neutral";
  const icon = alertInfo ? alertTypeToIcon(alertInfo?.type) : null;

  const onClickAction = async (action: AlertAction) => {
    setLoading(true);
    await action.onClick();
    setLoading(false);
  };

  return (
    <Snackbar
      size="sm"
      variant="outlined"
      color={color}
      open={open}
      onClose={dismiss}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      startDecorator={icon}
      endDecorator={
        <IconButton onClick={dismiss} size="sm" variant="plain" color={color}>
          <CloseIcon />
        </IconButton>
      }
    >
      <Stack direction="column">
        <Typography title="body-xs" color={color} fontWeight="lg">
          {alertInfo?.title}
        </Typography>
        <Typography level="body-xs" color={color}>
          {alertInfo?.message}
        </Typography>
        {alertInfo?.actions && (
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            {alertInfo.actions.map((action) => (
              <Button
                size="sm"
                loading={loading}
                onClick={async () => onClickAction(action)}
              >
                {action.title}
              </Button>
            ))}
          </Box>
        )}
      </Stack>
    </Snackbar>
  );
}

function AlertModal({ alertInfo, onDismiss }: AlertDialogProps) {
  const [open, setOpen] = useState(!!alertInfo);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setOpen(!!alertInfo);
  }, [alertInfo]);

  const dismiss = () => {
    setOpen(false);
    onDismiss();
  };

  const onClick = async (action: AlertAction) => {
    setLoading(true);
    await action.onClick();
    setLoading(false);
    dismiss();
  };

  const color = alertInfo ? alertTypeToColor(alertInfo?.type) : "neutral";
  const icon = alertInfo ? alertTypeToIcon(alertInfo?.type) : null;

  return (
    <Modal open={open} onClose={dismiss}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle color={color}>
          {icon} {alertInfo.title}
        </DialogTitle>
        <Divider />
        <DialogContent>{alertInfo.message}</DialogContent>
        {alertInfo.actions && (
          <DialogActions>
            {alertInfo.actions.map((action) => (
              <Button
                variant={action.variant}
                color={color}
                loading={loading}
                onClick={async () => await onClick(action)}
              >
                {action.title}
              </Button>
            ))}
            <Button variant="plain" color="neutral" onClick={dismiss}>
              Cancel
            </Button>
          </DialogActions>
        )}
      </ModalDialog>
    </Modal>
  );
}

export function AlertDisplay({ alertInfo, onDismiss }: AlertDisplayProps) {
  if (!alertInfo) {
    return <></>;
  }
  return alertInfo.displayMode === AlertDisplayMode.Modal ? (
    <AlertModal alertInfo={alertInfo} onDismiss={onDismiss} />
  ) : (
    <AlertSnackbar alertInfo={alertInfo} onDismiss={onDismiss} />
  );
}
