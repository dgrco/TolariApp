import { createContext, useEffect, useState } from "react";
import { NewConfig, GetSettings, LoadConfig } from "../../wailsjs/go/main/App";

export interface ISettings {
  zoom: number;
}

interface ISettingsContextType {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>; // The type for useState's setter
}

// NOTE: this, along with Go's `AppSettings`, needs to be updated for each new setting.
const defaultSettings: ISettings = {
  zoom: 1,
}

export const SettingsContext = createContext<ISettingsContextType>({
  settings: defaultSettings,
  setSettings: () => { } // no-op
});

export const SettingsProvider = ({ children }: any) => {
  const [settings, setSettings] = useState<ISettings>(defaultSettings);

  useEffect(() => {
    (async () => {
      await LoadConfig(); // Load the config or create it if necessary
      setSettings(await GetSettings()); // Get the settings from the backend
    })();
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * settings.zoom}px`;
  }, [settings.zoom]);

  if (!settings)
    return null;

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
