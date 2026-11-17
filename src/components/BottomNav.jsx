import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeIcon, UsersIcon, BriefcaseIcon, WalletIcon } from './Icons';

export default function BottomNav() {
  const { currentScreen, navigateTo } = useApp();

  const isTabActive = (tabName) => {
    if (tabName === 'dashboard' && currentScreen === 'dashboard') return true;
    if (tabName === 'candidates' && (currentScreen === 'candidates' || currentScreen === 'candidate-detail')) return true;
    if (tabName === 'placements' && (currentScreen === 'placements' || currentScreen === 'clients')) return true;
    if (tabName === 'money' && currentScreen === 'money') return true;
    return false;
  };

  return (
    <nav className="mobile-bottom-nav">
      <button 
        type="button"
        className={`mobile-nav-btn ${isTabActive('dashboard') ? 'active' : ''}`}
        onClick={() => navigateTo('dashboard')}
      >
        <span className="nav-icon"><HomeIcon size={20} /></span>
        <span className="label">Accueil</span>
      </button>

      <button 
        type="button"
        className={`mobile-nav-btn ${isTabActive('candidates') ? 'active' : ''}`}
        onClick={() => navigateTo('candidates')}
      >
        <span className="nav-icon"><UsersIcon size={20} /></span>
        <span className="label">Candidats</span>
      </button>

      <button 
        type="button"
        className={`mobile-nav-btn ${isTabActive('placements') ? 'active' : ''}`}
        onClick={() => navigateTo('placements')}
      >
        <span className="nav-icon"><BriefcaseIcon size={20} /></span>
        <span className="label">Placements</span>
      </button>

      <button 
        type="button"
        className={`mobile-nav-btn ${isTabActive('money') ? 'active' : ''}`}
        onClick={() => navigateTo('money')}
      >
        <span className="nav-icon"><WalletIcon size={20} /></span>
        <span className="label">Argent</span>
      </button>
    </nav>
  );
}
