import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ShowNotification } from "../../wailsjs/go/main/App";
import { SettingsContext } from "./SettingsContext";

interface PomodoroContextType {
  minutes: number;
  seconds: number;
  isActive: boolean;
  hasBeenActive: boolean;
  hidden: boolean;
  phase: Phase;
  loaded: boolean;
  startPomodoroTimer: () => void;
  stopPomodoroTimer: () => void;
  resetPomodoroTimer: () => void;
  skipPhase: () => void;
  getProgress: () => number;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const PomodoroContext = createContext<PomodoroContextType>({} as PomodoroContextType);

export const usePomodoroContext = () => useContext(PomodoroContext);

export enum Phase {
  WORK,
  SHORT_BREAK,
  LONG_BREAK,
}

export const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const settingsContext = useContext(SettingsContext);

  const workMinutes = settingsContext.settings.timerWorkMinutes;
  const workSeconds = settingsContext.settings.timerWorkSeconds;
  const shortBreakMinutes = settingsContext.settings.timerShortBreakMinutes;
  const shortBreakSeconds = settingsContext.settings.timerShortBreakSeconds;
  const longBreakMinutes = settingsContext.settings.timerLongBreakMinutes;
  const longBreakSeconds = settingsContext.settings.timerLongBreakSeconds;

  const [phase, setPhase] = useState<Phase>(Phase.WORK);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasBeenActive, setHasBeenActive] = useState(false); // Set to true on first activation
  const [hidden, setHidden] = useState(false);
  const [_, setWorkIteration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const getPhaseTotalTime = (p: Phase) => {
    switch (p) {
      case Phase.WORK:
        return workMinutes * 60 + workSeconds;
      case Phase.SHORT_BREAK:
        return shortBreakMinutes * 60 + shortBreakSeconds;
      case Phase.LONG_BREAK:
        return longBreakMinutes * 60 + longBreakSeconds;
      default:
        return 0;
    }
  }

  // Update remaining time whenever the durations change
  useEffect(() => {
    setIsActive(false);
    setRemainingSeconds(getPhaseTotalTime(phase));
    setLoaded(true); // Mainly for the initial load
  }, [workMinutes, workSeconds, shortBreakMinutes, shortBreakSeconds, longBreakMinutes, longBreakSeconds]);

  const setPhaseWithDuration = (newPhase: Phase) => {
    setPhase(newPhase);
    setRemainingSeconds(getPhaseTotalTime(newPhase));
  }

  const scheduleNext = () => {
    if (phase === Phase.WORK) {
      sendNotification("Tungsten", "Time for a break!");
    } else {
      sendNotification("Tungsten", "Time to work. You got this!");
    }
    if (phase === Phase.WORK) {
      setWorkIteration((prev) => {
        const next = prev + 1;
        if (next % 4 === 0) {
          // Long Break
          setPhaseWithDuration(Phase.LONG_BREAK);
        } else {
          // Short Break
          setPhaseWithDuration(Phase.SHORT_BREAK);
        }
        return next;
      })
    } else {
      // Return to work
      setPhaseWithDuration(Phase.WORK);
    }
  }

  const sendNotification = async (title: string, content: string) => {
    await ShowNotification(title, content);
  }

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 0) {
          setIsActive(false);
          scheduleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000)

    return () => clearInterval(interval);
  }, [isActive]);

  const startPomodoroTimer = () => {
    setIsActive(true);
    if (!hasBeenActive) {
      setHasBeenActive(true);
    }
  }
  const stopPomodoroTimer = () => setIsActive(false);
  const skipPhase = () => {
    setIsActive(false);
    scheduleNext();
  }
  const resetPomodoroTimer = () => {
    setIsActive(false);
    setPhaseWithDuration(Phase.WORK);
  }

  const getProgress = (): number => {
    const totalTime = getPhaseTotalTime(phase);

    if (totalTime === 0) return 0;

    return (totalTime - remainingSeconds) / totalTime;
  }

  // Derived values
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const value = {
    minutes,
    seconds,
    isActive,
    hasBeenActive,
    hidden,
    setHidden,
    phase,
    loaded,
    startPomodoroTimer,
    stopPomodoroTimer,
    resetPomodoroTimer,
    skipPhase,
    getProgress,
  }

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  )
} 
