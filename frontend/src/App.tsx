// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { checkAuth } from './store/slices/authSlice';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ImportPage from './pages/ImportPage';
import MechListPage from './pages/MechListPage';
import FactionListPage from './pages/FactionListPage';
import FactionManagementPage from './pages/FactionManagementPage';
import GameManagementPage from './pages/GameManagementPage';
import RawMechValidationPage from './pages/RawMechValidationPage';
import PeriodListPage from './pages/PeriodListPage';
import MechAvailabilityPage from './pages/AvailabilityPage';
import MissionListPage from './pages/MissionListPage';
import MissionDetailPage from './pages/MissionDetailPage';
import BT_Page from './pages/BT_Page';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagementPage from './pages/UserManagementPage';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Проверяем аутентификацию при загрузке приложения
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bt" element={<BT_Page />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Защищенные маршруты */}
                           <Route path="/import" element={
                   <ProtectedRoute requiredRoles={['ADMIN']}>
                     <ImportPage />
                   </ProtectedRoute>
                 } />

                 <Route path="/users" element={
                   <ProtectedRoute requiredRoles={['ADMIN']}>
                     <UserManagementPage />
                   </ProtectedRoute>
                 } />

                 <Route path="/factions/manage" element={
                   <ProtectedRoute requiredRoles={['ADMIN']}>
                     <FactionManagementPage />
                   </ProtectedRoute>
                 } />

                                                <Route path="/games/manage" element={
                                 <ProtectedRoute requiredRoles={['ADMIN']}>
                                   <GameManagementPage />
                                 </ProtectedRoute>
                               } />

                               <Route path="/raw-mechs/validate" element={
                                 <ProtectedRoute requiredRoles={['ADMIN']}>
                                   <RawMechValidationPage />
                                 </ProtectedRoute>
                               } />

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