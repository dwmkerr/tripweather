import React, {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { DefaultColorPalette } from "@mui/joy/styles/types";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoIcon from "@mui/icons-material/Info";

import { TripWeatherError } from "../lib/Errors";

export enum AlertType {
  Info,
  Warning,
  Error,
  Success,
}

export enum AlertDisplayMode {
  Snackbar,
  Modal,
}

export interface AlertAction {
  onClick: () => Promise<void>;
  title: string;
  variant?: "plain" | "outlined" | "soft" | "solid";
}

export interface AlertInfo {
  type: AlertType;
  displayMode: AlertDisplayMode;
  title: string;
  message: string;
  actions?: AlertAction[];
}

//  Helper functions that many consumers of the provider might use for styling.
export function alertTypeToColor(type: AlertType): DefaultColorPalette {
  switch (type) {
    case AlertType.Info:
      return "neutral";
    case AlertType.Warning:
      return "warning";
    case AlertType.Error:
      return "danger";
    case AlertType.Success:
      return "success";
    default:
      return "neutral";
  }
}
export function alertTypeToIcon(type: AlertType): ReactNode {
  switch (type) {
    case AlertType.Info:
      return <InfoIcon />;
    case AlertType.Warning:
      return <WarningAmberIcon />;
    case AlertType.Error:
      return <ErrorOutlineIcon />;
    case AlertType.Success:
      return <CheckCircleOutlineIcon />;
    default:
      return <HelpOutlineIcon />;
  }
}

interface AlertContextValue {
  alertInfo: AlertInfo | null;
  setAlertInfo: (alert: AlertInfo | null) => void;
  setAlertFromError: (error: TripWeatherError) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export const AlertContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null);

  const value: AlertContextValue = {
    alertInfo,
    setAlertInfo,
    //  Essentially just a helper to build an alert from an error.
    setAlertFromError: (error: TripWeatherError) =>
      setAlertInfo({
        type: AlertType.Error,
        displayMode: AlertDisplayMode.Snackbar,
        title: error.title,
        message: error.message,
      }),
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};
