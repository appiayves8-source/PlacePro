import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { agency, currentScreen, goBack, resetDemoData } = useApp();

  const isSubScreen = currentScreen !== 'dashboard';

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'candidates': return 'Annuaire des Candidats';
      case 'candidate-detail': return 'Fiche du Candidat';
      case 'placements': return 'Contrats de Placement';
      case 'money': return 'Suivi Financier & Reçus';
      case 'clients': return 'Répertoire des Clients';
      default: return agency.name;
    }
  };

  return (
    <>
      <div className="demo-banner">
        <span>Mode Démonstration • Agence : {agency.name}</span>
        <button onClick={resetDemoData} className="btn-reset-demo" title="Réinitialiser les données de test">
          Réinitialiser démo
        </button>
      </div>

      <header className="app-header">
        <div className="header-top">
          {isSubScreen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
              <button 
                onClick={goBack} 
                className="btn btn-outline" 
                style={{ 
                  color: '#FFFFFF', 
                  borderColor: 'rgba(255,255,255,0.25)', 
                  padding: '8px 14px', 
                  minHeight: '44px',
                  borderRadius: '10px'
                }}
              >
                ← Retour
              </button>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                  {getScreenTitle()}
                </h1>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                  {agency.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="agency-brand">
              <div className="agency-logo-badge">
                {agency.logoInitials}
              </div>
              <div className="agency-info">
                <h1>Bienvenue {agency.name}</h1>
                <p>{agency.city} • Suivi du personnel</p>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
