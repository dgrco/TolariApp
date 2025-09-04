import { Route, Routes } from 'react-router-dom';
import AddPage from './screens/add';
import HomePage from './screens/home';
import Board from './screens/board';
import Review from './screens/review';
import SettingsPage from './screens/settings';
import { DragProvider } from './contexts/DragContext';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/add" element={<AddPage />} />
      <Route path="/review" element={<Review />} />
      <Route path="/plan" element={
        <DragProvider>
          <Board />
        </DragProvider>
      } />
    </Routes>
  )
}

export default App
