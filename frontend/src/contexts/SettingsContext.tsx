import { createContext, useEffect, useState } from "react";
import { NewConfig, GetSettings, LoadConfig, SaveConfig } from "../../wailsjs/go/main/App";

export interface ISettings {
  zoom: number;
  timerWorkMinutes: number;
  timerWorkSeconds: number;
  timerShortBreakMinutes: number;
  timerShortBreakSeconds: number;
  timerLongBreakMinutes: number;
  timerLongBreakSeconds: number;
}

interface ISettingsContextType {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>; // The type for useState's setter
}

// NOTE: this, along with Go's `AppSettings`, needs to be updated for each new setting.
const defaultSettings: ISettings = {
  zoom: 1,
  timerWorkMinutes: 25,
  timerWorkSeconds: 0,
  timerShortBreakMinutes: 5,
  timerShortBreakSeconds: 0,
  timerLongBreakMinutes: 10,
  timerLongBreakSeconds: 0,
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

  useEffect(() => {
    (async () => {
      const originalSettings = await GetSettings();
      // We can directly compare `settings` with `defaultSettings` because it would share
      // the same reference if they were equal. For `originalSettings`, however, we need 
      // to compare each field since `originalSettings` is newly allocated above.
      if (settings === defaultSettings ||
        JSON.stringify(settings) === JSON.stringify(originalSettings)) {
        return;
      }
      // Otherwise, save on change.
      await SaveConfig(settings);
    })();
  }, [settings])

  if (!settings)
    return null;

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
