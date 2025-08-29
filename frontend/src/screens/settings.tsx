import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/dropdown';
import { ISettings, SettingsContext } from '../contexts/SettingsContext';
import { SaveConfig } from "../../wailsjs/go/main/App";
import styles from './settings.module.css';

export default function SettingsPage() {
  const settingsCtx = useContext(SettingsContext);

  const reset = () => {
    settingsCtx.setSettings({
      zoom: 1,
    });
  };

  return (
    <div id={styles.settings} className="fade-up">
      <div id={styles.topBar}>
        <Link to="/" className={`${styles.btn} ${styles.btnSecondaryBg} ${styles.iconBtn}`}>
          🠔
        </Link>
      </div>
      <div id={styles.main}>
        <span style={{ fontSize: "2rem" }}>Settings</span>
        <hr />
        <div className={styles.row} id={styles.zoom}>
          <span>Zoom</span>
          <span className={styles.brief}>scale the UI by some percentage</span>
          <Dropdown
            default={settingsCtx.settings.zoom}
            options={[
              { value: 0.9, label: '90%' },
              { value: 1.0, label: '100%' },
              { value: 1.1, label: '110%' },
              { value: 1.25, label: '125%' },
              { value: 1.5, label: '150%' },
            ]}
            onChange={async (val: string) => {
              const settings: ISettings = {
                ...settingsCtx.settings,
                zoom: parseFloat(val)
              }
              settingsCtx.setSettings(settings);
              console.log(settings)
              await SaveConfig(settings);
            }}
          />
        </div>
        <div id={styles.endOfSettings}>
          End of Settings
        </div>
      </div>
    </div>
  );
}
