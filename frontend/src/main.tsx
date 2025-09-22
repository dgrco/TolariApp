import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { SettingsProvider } from './contexts/SettingsContext'
import { FlashcardProvider } from './contexts/FlashcardContext'
import { PomodoroProvider } from './contexts/PomodoroContext'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <SettingsProvider>
      <FlashcardProvider>
        <PomodoroProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </PomodoroProvider>
      </FlashcardProvider>
    </SettingsProvider>
  </React.StrictMode>
)
