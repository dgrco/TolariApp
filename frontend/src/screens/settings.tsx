import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/dropdown';
import { SettingsContext } from '../contexts/SettingsContext';
import { SaveConfig } from "../../wailsjs/go/main/App";

export default function SettingsPage() {
  const settingsCtx = useContext(SettingsContext);

  const reset = () => {
    settingsCtx.setSettings({
      zoom: 1,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-dark p-4">
      <div className="flex justify-start mb-4">
        <Link to="/" className="p-2 p-2 w-10 h-10 rounded-full bg-dark-secondary flex items-center justify-center hover:bg-dark-secondary-hover transition-colors duration-200">
          &#8592;
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-3xl font-bold">Settings</span>
        <hr className="w-full h-px border-none bg-text opacity-30 my-4" />
        <div className="flex items-center justify-between py-2 px-5 border-b border-border bg-dark-secondary">
          <span>Zoom</span>
          <span className="italic text-sm opacity-60">scale the UI by some percentage</span>
          <Dropdown
            value={settingsCtx.settings.zoom}
            options={[
              { value: 0.9, label: '90%' },
              { value: 1.0, label: '100%' },
              { value: 1.1, label: '110%' },
              { value: 1.25, label: '125%' },
              { value: 1.5, label: '150%' },
            ]}
            onChange={async (val) => {
              const settings = {
                ...settingsCtx.settings,
                zoom: parseFloat(val)
              };
              settingsCtx.setSettings(settings);
              console.log(settings);
              await SaveConfig(settings);
            }}
          />
        </div>
        <div className="flex justify-center text-sm bg-dark-secondary p-3 rounded-b-2xl">
          End of Settings
        </div>
      </div>
    </div>
  );
}
