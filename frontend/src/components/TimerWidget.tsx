import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phase, usePomodoroContext } from "../contexts/PomodoroContext";

// NOTE: timeElapsed is in seconds; size is in rem.
export default function TimerWidget({ size, embed = false }: {
  size: number,
  embed?: boolean
}) {
  const pomodoroContext = usePomodoroContext();
  const [hovering, setHovering] = useState(false);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference * (1 - pomodoroContext.getProgress());

  const timerFontSize = size / 5;

  const lerp = (a: number, b: number, t: number) => {
    return a + (b - a) * t;
  }

  const lerpHSL = (fromHSL: [number, number, number], toHSL: [number, number, number], progress: number): [number, number, number] => {
    return [
      lerp(fromHSL[0], toHSL[0], progress),
      lerp(fromHSL[1], toHSL[1], progress),
      lerp(fromHSL[2], toHSL[2], progress),
    ];
  }

  // Colors
  let currentHSL = [0, 0, 0];
  if (pomodoroContext.phase === Phase.WORK) {
    currentHSL = lerpHSL([273, 100, 68.7], [273, 100, 83.5], pomodoroContext.getProgress());
  } else if (pomodoroContext.phase === Phase.SHORT_BREAK) {
    currentHSL = lerpHSL([147, 71, 29], [210, 92, 75], pomodoroContext.getProgress());
  } else {
    currentHSL = lerpHSL([37, 100, 60], [49, 100, 60], pomodoroContext.getProgress());
  }

  const phaseText = () => {
    if (pomodoroContext.phase === Phase.WORK) {
      return "Work";
    } else if (pomodoroContext.phase === Phase.SHORT_BREAK) {
      return "Short Break";
    } else {
      return "Long Break";
    }
  }

  if (!pomodoroContext.loaded) return <div></div>;

  if (embed) {
    if (!pomodoroContext.hasBeenActive) {
      return <div></div>
    }

    if (pomodoroContext.hidden) {
      return (
        <button
          className="p-2 bg-dark-secondary cursor-pointer opacity-30 rounded-full z-10 hover:bg-dark-secondary-hover hover:opacity-100 transition-all select-none outline-none"
          onClick={() => pomodoroContext.setHidden(false)}
        >
          <EyeIcon />
        </button>
      )
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <button
            className={`absolute top-0 right-0 bg-dark-secondary cursor-pointer p-2 rounded-full z-10 ${hovering ? 'opacity-30' : 'opacity-0'} hover:bg-dark-secondary-hover hover:opacity-100 transition-all select-none outline-none`}
            onClick={() => pomodoroContext.setHidden(true)}
          >
            <EyeIcon />
          </button>
          <Link draggable="false" to="/timer" className="block px-4 py-2 hover:bg-dark-secondary hover:opacity-85 w-full h-full rounded-lg transition-colors">
            <div className="relative flex items-center justify-center" style={{ width: `${size - 0.5}rem`, height: `${size - 0.5}rem` }}>
              {/* Container for the text */}
              <div className="absolute flex flex-col">
                <span className="font-bold text-slate-100 tracking-wider" style={{ fontSize: `${timerFontSize}rem` }}>
                  {/* Pad with leading zero if needed */}
                  {String(pomodoroContext.minutes).padStart(2, '0')}:{String(pomodoroContext.seconds).padStart(2, '0')}
                </span>
              </div>

              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  strokeWidth="5"
                  className="stroke-slate-700"
                  fill="transparent"
                />

                {/* Foreground (Progress) Circle */}
                <AnimatePresence mode="wait">
                  <motion.circle
                    key={pomodoroContext.phase}
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeWidth="5"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{
                      strokeDashoffset: circumference,
                      opacity: 0,
                    }}
                    // Animate the strokeDashoffset property
                    animate={{
                      strokeDashoffset,
                      opacity: pomodoroContext.getProgress() ? 1 : 0,
                      stroke: `hsl(${currentHSL[0]}, ${currentHSL[1]}%, ${currentHSL[2]}%)`,
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.25 }
                    }}
                    transition={{
                      strokeDashoffset: { duration: 1, ease: "linear" },
                      opacity: { duration: 0.3, ease: "easeInOut" },
                      stroke: { duration: 0.75, ease: "easeInOut" },
                    }}
                  />
                </AnimatePresence>
              </svg>
            </div>
            <div className="flex justify-center">
              <motion.div
                className="inline-flex px-2 py-1 mt-1 text-[0.7rem] rounded-full"
                initial={{ border: '2px solid transparent' }}
                animate={{ border: `2px solid hsl(${currentHSL[0]}, ${currentHSL[1]}%, ${currentHSL[2]}%)` }}
              >
                <span className="self-center">{phaseText()}</span>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: `${size}rem`, height: `${size}rem` }}>
      {/* Container for the text */}
      <div className="absolute flex flex-col items-center justify-between">
        <span className="h-10">{/* Spacer */}</span>
        <span className="font-bold text-slate-100 tracking-wider" style={{ fontSize: `${timerFontSize}rem` }}>
          {/* Pad with leading zero if needed */}
          {String(pomodoroContext.minutes).padStart(2, '0')}:{String(pomodoroContext.seconds).padStart(2, '0')}
        </span>
        <motion.div
          className="flex px-4 h-10 text-lg rounded-full"
          initial={{ border: '2px solid transparent' }}
          animate={{ border: `2px solid hsl(${currentHSL[0]}, ${currentHSL[1]}%, ${currentHSL[2]}%)` }}
        >
          <span className="self-center">{phaseText()}</span>
        </motion.div>
      </div>

      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="5"
          className="stroke-slate-700"
          fill="transparent"
        />

        {/* Foreground (Progress) Circle */}
        <AnimatePresence mode="wait">
          <motion.circle
            key={pomodoroContext.phase}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="5"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{
              strokeDashoffset: circumference,
              opacity: 0,
            }}
            // Animate the strokeDashoffset property
            animate={{
              strokeDashoffset,
              opacity: pomodoroContext.getProgress() ? 1 : 0,
              stroke: `hsl(${currentHSL[0]}, ${currentHSL[1]}%, ${currentHSL[2]}%)`,
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.25 }
            }}
            transition={{
              strokeDashoffset: { duration: 1, ease: "linear" },
              opacity: { duration: 0.3, ease: "easeInOut" },
              stroke: { duration: 0.75, ease: "easeInOut" },
            }}
          />
        </AnimatePresence>
      </svg>
    </div>
  )
}

const EyeIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
  )
}
