import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import CandidatesView from './components/CandidatesView';
import CandidateDetail from './components/CandidateDetail';
import PlacementsView from './components/PlacementsView';
import MoneyView from './components/MoneyView';
import ClientsView from './components/ClientsView';
import AddCandidateModal from './components/AddCandidateModal';
import AddClientModal from './components/AddClientModal';
import NewPlacementModal from './components/NewPlacementModal';
import RecordPaymentModal from './components/RecordPaymentModal';
import CreateAgencyModal from './components/CreateAgencyModal';
import NotificationsModal from './components/NotificationsModal';
import WorkerPortal from './components/WorkerPortal';
import FamilyPortal from './components/FamilyPortal';
import ErrorBoundary from './components/ErrorBoundary';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AgencyLockScreen from './components/AgencyLockScreen';
import SubscriptionView from './components/SubscriptionView';
import LoginView from './components/LoginView';
import PaymentModal from './components/PaymentModal';

function AppContent() {
  const {
    currentScreen,
    goBack,
    setIsAddCandidateOpen,
    portalView,
    portalEntityId,
    isCurrentAgencyLocked,
    isLoggedIn
  } = useApp();

  // Si l'utilisateur s'est déconnecté de son espace
  if (!isLoggedIn || currentScreen === 'login') {
    return (
      <>
        <LoginView />
        <CreateAgencyModal />
      </>
    );
  }

  // Si on ouvre l'application via un lien portail direct (Employé ou Famille)
  if (portalView === 'worker') {
    return <WorkerPortal candidateId={portalEntityId} />;
  }

  if (portalView === 'family') {
    return <FamilyPortal clientId={portalEntityId} />;
  }

  // Si l'abonnement de l'agence active est expiré ou suspendu (Paywall actif)
  if (isCurrentAgencyLocked) {
    return (
      <>
        <AgencyLockScreen />
        <PaymentModal />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Barre latérale visible sur écran >= 900px */}
      <Sidebar />

      {/* Conteneur principal */}
      <div className="main-wrapper">
        <TopBar />

        <main style={{ flex: 1 }}>
          {/* Écrans de détails avec barre de retour */}
          {currentScreen !== 'dashboard' && currentScreen !== 'super-admin' && (
            <div style={{ padding: '16px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={goBack}
                className="btn btn-outline"
                style={{ borderRadius: '10px' }}
              >
                ← Retour au tableau de bord
              </button>

              {currentScreen === 'candidates' && (
                <button
                  onClick={() => setIsAddCandidateOpen(true)}
                  className="btn btn-navy"
                  style={{ borderRadius: '10px', fontSize: '12px' }}
                >
                  + Ajouter Candidat
                </button>
              )}
            </div>
          )}

          {currentScreen === 'dashboard' && <Dashboard />}
          {currentScreen === 'super-admin' && <SuperAdminDashboard />}
          {currentScreen === 'candidates' && <CandidatesView />}
          {currentScreen === 'candidate-detail' && <CandidateDetail />}
          {currentScreen === 'placements' && <PlacementsView />}
          {currentScreen === 'money' && <MoneyView />}
          {currentScreen === 'clients' && <ClientsView />}
          {currentScreen === 'subscription' && <SubscriptionView />}
        </main>
      </div>

      {/* Toutes les Modales fonctionnelles de PlacePro */}
      <AddCandidateModal />
      <AddClientModal />
      <NewPlacementModal />
      <RecordPaymentModal />
      <CreateAgencyModal />
      <NotificationsModal />
      <PaymentModal />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
