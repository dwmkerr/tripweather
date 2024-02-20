import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { LifeEvent } from "../lib/LifeEvent";

interface DialogContextValue {
  showImportDialog: boolean;
  setShowImportDialog: (show: boolean) => void;
  showExportDialog: boolean;
  setShowExportDialog: (show: boolean) => void;
  showAddEventDialog: boolean;
  setShowAddEventDialog: (show: boolean) => void;
  showUserSettingsDialog: boolean;
  setShowUserSettingsDialog: (show: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  showCategoriesDialog: boolean;
  setShowCategoriesDialog: (show: boolean) => void;
  deleteEventModalEvent?: LifeEvent;
  setDeleteEventModalEvent: (event?: LifeEvent) => void;
  editEventModalEvent?: LifeEvent;
  setEditEventModalEvent: (event?: LifeEvent) => void;
  showFeedbackDialog: boolean;
  setShowFeedbackDialog: (show: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const DialogContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [showAddEventDialog, setShowAddEventDialog] = useState<boolean>(false);
  const [showUserSettingsDialog, setShowUserSettingsDialog] =
    useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCategoriesDialog, setShowCategoriesDialog] =
    useState<boolean>(false);
  const [deleteEventModalEvent, setDeleteEventModalEvent] = useState<
    LifeEvent | undefined
  >(undefined);
  const [editEventModalEvent, setEditEventModalEvent] = useState<
    LifeEvent | undefined
  >(undefined);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState<boolean>(false);

  const value: DialogContextValue = {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
    showAddEventDialog,
    setShowAddEventDialog,
    showUserSettingsDialog,
    setShowUserSettingsDialog,
    showFilters,
    setShowFilters,
    showCategoriesDialog,
    setShowCategoriesDialog,
    deleteEventModalEvent,
    setDeleteEventModalEvent,
    editEventModalEvent,
    setEditEventModalEvent,
    showFeedbackDialog,
    setShowFeedbackDialog,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      "useDialogContext must be used within a DialogContextProvider",
    );
  }
  return context;
};
