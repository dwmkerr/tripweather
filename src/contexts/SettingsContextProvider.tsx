import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { Settings } from "../lib/Settings";

interface SettingsContextValue {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const today = new Date();
  const initialSettings: Settings = {
    startDate: new Date(today.setDate(today.getDate() - 2)),
    endDate: new Date(today.setDate(today.getDate() + 5)),
    units: "uk",
  };

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const value: SettingsContextValue = {
    showSettings,
    setShowSettings,
    settings,
    setSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a SettingsContextProvider",
    );
  }
  return context;
};
