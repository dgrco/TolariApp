import { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Dropdown from '../components/dropdown';
import { SettingsContext } from '../contexts/SettingsContext';
import { SaveConfig } from "../../wailsjs/go/main/App";
import { motion } from "framer-motion";
import NumberInput from '../components/NumericInput';

interface RowProps {
  title: string;
  desc: string;
  start?: boolean;
  end?: boolean;
  children: React.ReactNode;
}

const Separator = () => {
  return <span className='border-b border-border bg-dark-secondary w-full'></span>
}

const Row = ({ title, desc, start = false, end = false, children }: RowProps) => {
  return (
    <>
      <div className={`flex items-center justify-between py-2 px-5 bg-dark-secondary ${start ? 'rounded-t-lg' : ''} ${end ? 'rounded-b-lg' : ''}`}>
        <div className="flex items-center">
          <span>{title}</span>
          <span className="text-sm px-4 opacity-50">{desc}</span>
        </div>
        {children}
      </div>
      {end === false &&
        <Separator />
      }
    </>
  )
}

interface CategoryProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Category = ({ id, title, children }: CategoryProps) => {
  return (
    <>
      <style>
        {`
          .highlight {
            background-color: rgba(124, 58, 237, 0.85);
          }
        `}
      </style>
      <div id={id} className="flex flex-col p-2 rounded-lg bg-dark transition-colors">
        <div className="w-fit px-2 py-1 my-2 text-lg text-text bg-gray-700 font-semibold rounded-lg">
          {title}
        </div>
        {children}
      </div>
    </>
  )
}

export default function SettingsPage() {
  const settingsCtx = useContext(SettingsContext);
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        el.classList.add("highlight");
        setTimeout(() => el.classList.remove("highlight"), 1500);
      }
    }
  }, [hash])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-dark p-4 overflow-y-auto"
    >
      <div className="flex justify-start mb-4">
        <button
          className="p-2 w-10 h-10 rounded-full bg-dark-secondary flex items-center justify-center hover:bg-dark-secondary-hover transition-colors duration-200"
          onClick={() => navigate(-1)}
        >
          &#8592;
        </button>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-3xl font-bold">Settings</span>
        <hr className="w-full h-px border-none bg-text opacity-30 my-4" />
        <Category id="appearance" title="Appearance">
          <Row title="Zoom" desc="Adjust the sizing of the User Interface" start end>
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
              }}
            />
          </Row>
        </Category>
        <Category id="timer" title="Timer">
          <Row title="Work Duration" desc="Time duration of the work period" start>
            <div className="flex gap-2 items-center">
              <NumberInput
                onChange={(value) => {
                  settingsCtx.setSettings((prev) => ({
                    ...prev,
                    timerWorkMinutes: value,
                  }))
                }}
                defaultValue={settingsCtx.settings.timerWorkMinutes}
                min={0}
                max={59}
                className="w-16 bg-dark-secondary border-2 border-border p-2 rounded-lg text-center"
              />
              <p className='mr-1'>Minutes</p>
              <NumberInput
                onChange={(value) => {
                  settingsCtx.setSettings((prev) => ({
                    ...prev,
                    timerWorkSeconds: value,
                  }))
                }}
                defaultValue={settingsCtx.settings.timerWorkSeconds}
                min={0}
                max={59}
                className="w-16 bg-dark-secondary border-2 border-border p-2 rounded-lg text-center"
              />
              <p>Seconds</p>
            </div>
          </Row>
          <Row title="Short Break Duration" desc="Time duration of the short break period">
            <div className="flex gap-2 items-center">
              <NumberInput
                onChange={(value) => {
                  settingsCtx.setSettings((prev) => ({
                    ...prev,
                    timerShortBreakMinutes: value,
                  }))
                }}
                defaultValue={settingsCtx.settings.timerShortBreakMinutes}
                min={0}
                max={59}
                className="w-16 bg-dark-secondary border-2 border-border p-2 rounded-lg text-center"
              />
              <p className='mr-1'>Minutes</p>
              <NumberInput
                onChange={(value) => {
                  settingsCtx.setSettings((prev) => ({
                    ...prev,
                    timerShortBreakSeconds: value,
                  }))
                }}
                defaultValue={settingsCtx.settings.timerShortBreakSeconds}
                min={0}
                max={59}
                className="w-16 bg-dark-secondary border-2 border-border p-2 rounded-lg text-center"
              />
              <p>Seconds</p>
            </div>
          </Row>
          <Row title="Long Break Duration" desc="Time duration of the long break period" end>
            <div className="flex gap-2 items-center">
              <NumberInput
                onChange={(value) => {
                  settingsCtx.setSettings((prev) => ({
                    ...prev,
                    timerLongBreakMinutes: value,
                  }))
                }}
                defaultValue={settingsCtx.settings.timerLongBreakMinutes}
                min={0}
                max={59}
                className="w-16 bg-dark-secondary border-2 border-border p-2 rounded-lg text-center"
              />
              <p className='mr-1'>Minutes</p>
              <NumberInput
                onChange={(value) => {
                  settingsCtx.setSettings((prev) => ({
                    ...prev,
                    timerLongBreakSeconds: value,
                  }))
                }}
                defaultValue={settingsCtx.settings.timerLongBreakSeconds}
                min={0}
                max={59}
                className="w-16 bg-dark-secondary border-2 border-border p-2 rounded-lg text-center"
              />
              <p>Seconds</p>
            </div>
          </Row>
        </Category>
      </div>
    </motion.div >
  );
}
