import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TimerWidget from "../components/TimerWidget";
import { usePomodoroContext } from "../contexts/PomodoroContext";

export default function PomodoroTimer() {
  const pomodoroContext = usePomodoroContext();
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimerActive(false);
  }, [pomodoroContext.phase])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-dark p-4"
    >
      <div className="flex justify-start mb-4">
        <button
          className="p-2 w-10 h-10 rounded-full bg-dark-secondary flex items-center justify-center hover:bg-dark-secondary-hover transition-colors duration-200"
          onClick={() => navigate(-1)}
        >
          &#8592;
        </button>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center select-none">
        <div>
          <TimerWidget
            size={20} // in rem
            embed={false}
          />
        </div>
        <div className="my-4 flex justify-between gap-4">
          <span className="w-12">{/* Spacing (must be same width as SkipIcon btn) */}</span>
          {
            timerActive ? (
              <button
                className="appearance-none bg-primary text-lg rounded-full w-24 py-2 hover:opacity-85"
                onClick={() => {
                  pomodoroContext.stopPomodoroTimer()
                  setTimerActive(false);
                }}
              >
                Pause
              </button>
            ) : (
              <button
                className="appearance-none bg-primary text-lg rounded-full w-24 py-2 hover:opacity-85"
                onClick={() => {
                  pomodoroContext.startPomodoroTimer()
                  setTimerActive(true);
                }}
              >
                Start
              </button>
            )
          }
          <button
            className="flex justify-center items-center appearance-none bg-transparent text-lg rounded-full w-12 py-2 hover:bg-dark-secondary hover:opacity-85"
            onClick={() => pomodoroContext.skipPhase()}
          >
            <SkipIcon />
          </button>
        </div>
      </div>
      <div className="fixed bottom-2 self-center text-slate-500">
        You can adjust the duration of each phase in the 
        <Link 
          to="/settings#timer" 
          className="underline pl-1"
        >
          settings
        </Link>.
      </div>
    </motion.div>
  )
}

const SkipIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-last-icon lucide-chevron-last"><path d="m7 18 6-6-6-6" /><path d="M17 6v12" /></svg>
  )
}
