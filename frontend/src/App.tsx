// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ImportPage from './pages/ImportPage';
import MechListPage from './pages/MechListPage';
import FactionListPage from './pages/FactionListPage';
import PeriodListPage from './pages/PeriodListPage';
import MechAvailabilityPage from './pages/AvailabilityPage';
import MissionListPage from './pages/MissionListPage';
import MissionDetailPage from './pages/MissionDetailPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/mechs" element={<MechListPage />} />
          <Route path="/factions" element={<FactionListPage />} />
          <Route path="/periods" element={<PeriodListPage />} />
          <Route path="/availability" element={<MechAvailabilityPage />} />
          <Route path="/missions" element={<MissionListPage />} />
          <Route path="/missions/:id" element={<MissionDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;