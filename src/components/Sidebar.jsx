import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DashboardIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  WalletIcon, 
  BuildingIcon 
} from './Icons';

function MenuNavList({ isMobile = false, onOpenLogoutConfirm }) {
  const { 
    agency,
    currentScreen, 
    navigateTo, 
    urgentItems, 
    unreadNotificationCount,
    setIsNotificationsOpen,
    setIsAddCandidateOpen,
    setIsNewPlacementOpen,
    setIsMobileMenuOpen
  } = useApp();

  const handleNav = (screen) => {
    navigateTo(screen);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const handleAction = (callback) => {
    callback();
    if (isMobile) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 2. Navigation Principale (Inspirée du layout Mondays) */}
      <ul className="sidebar-nav-list">
        {/* DASHBOARD - Mis en valeur avec l'icône de grille Mondays */}
        <li className={`sidebar-nav-item ${currentScreen === 'dashboard' ? 'active' : ''}`}>
          <button onClick={() => handleNav('dashboard')} title="Accéder au Tableau de bord principal">
            <DashboardIcon size={18} />
            <span>Dashboard</span>
          </button>
        </li>

        <li className={`sidebar-nav-item ${currentScreen === 'candidates' || currentScreen === 'candidate-detail' ? 'active' : ''}`}>
          <button onClick={() => handleNav('candidates')}>
            <UsersIcon size={18} />
            <span>Candidats</span>
          </button>
        </li>

        <li className={`sidebar-nav-item ${currentScreen === 'placements' ? 'active' : ''}`}>
          <button onClick={() => handleNav('placements')}>
            <BriefcaseIcon size={18} />
            <span>Placements</span>
          </button>
        </li>

        <li className={`sidebar-nav-item ${currentScreen === 'money' ? 'active' : ''}`}>
          <button onClick={() => handleNav('money')}>
            <WalletIcon size={18} />
            <span>Argent & Reçus</span>
          </button>
        </li>

        <li className={`sidebar-nav-item ${currentScreen === 'clients' ? 'active' : ''}`}>
          <button onClick={() => handleNav('clients')}>
            <BuildingIcon size={18} />
            <span>Clients & Familles</span>
          </button>
        </li>

        <li className={`sidebar-nav-item ${currentScreen === 'subscription' ? 'active' : ''}`}>
          <button onClick={() => handleNav('subscription')} title="Gérer votre formule d'abonnement et votre période de validité">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            <span>Mon Abonnement</span>
          </button>
        </li>

        <li className="sidebar-nav-item">
          <button 
            onClick={() => handleAction(() => setIsNotificationsOpen(true))}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <span>Signalements</span>
            </div>
            {unreadNotificationCount > 0 && (
              <span style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: '900',
                padding: '1px 7px',
                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
              }}>
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </li>

        {/* 3. Urgences en cours (si alertes actives) */}
        {urgentItems.length > 0 && (
          <li className="sidebar-nav-item" style={{ marginTop: '8px' }}>
            <div 
              onClick={() => handleNav('dashboard')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '9px 12px',
                backgroundColor: '#FEF2F2',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#991B1B',
                fontWeight: '700',
                cursor: 'pointer',
                border: '1px solid #FECACA'
              }}
              title="Consulter les urgences prioritaires sur le dashboard"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span>
                <span>Urgences en cours</span>
              </div>
              <span style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '2px 7px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800' }}>
                {urgentItems.length}
              </span>
            </div>
          </li>
        )}
      </ul>

      {/* 4. Bas de la colonne (Sidebar Footer) */}
      <div className="sidebar-footer">
        {/* Profil Agence avec le badge rond IN / AD (Action Déconnexion) */}
        <div
          onClick={onOpenLogoutConfirm}
          className="sidebar-profile-card"
          title="Cliquer pour vous déconnecter de votre espace"
        >
          <div className="sidebar-profile-avatar">
            {agency.logoInitials}
          </div>
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{agency.agency_id === 'admin' ? "Cyrille" : agency.name}</span>
            <span className="sidebar-profile-sub">
              {agency.agency_id === 'admin' ? "👑 Super Administrateur" : (agency.managerName || 'Espace Connecté')} • Déconnexion
            </span>
          </div>
          <div className="sidebar-profile-logout-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
        </div>

        <div style={{ fontSize: '10.5px', color: 'var(--color-text-subtle)', textAlign: 'center', marginTop: '10px' }}>
          PlacePro • Suivi du personnel CI
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const { 
    agency, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    logout 
  } = useApp();

  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsConfirmLogoutOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <>
      {/* 1. Sidebar Fixe sur Ordinateur (écran >= 900px) */}
      <aside className="desktop-sidebar">
        {/* Brand Logo PlacePro (Style Mondays) */}
        <div className="sidebar-logo" style={{ marginBottom: '6px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #B88E1F 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-navy)',
            fontWeight: '900',
            fontSize: '17px',
            boxShadow: '0 4px 10px rgba(212, 167, 44, 0.25)'
          }}>
            P
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-navy)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              PlacePro
            </span>
            <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {agency.agency_id === 'admin' ? "👑 Administration PlacePro" : agency.name}
            </span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '14px 0 16px 0' }} />

        <MenuNavList 
          isMobile={false} 
          onOpenLogoutConfirm={() => setIsConfirmLogoutOpen(true)} 
        />
      </aside>

      {/* 2. Menu Tiroir Mobile Responsive (Slide-Over Drawer) sur écran mobile (< 900px) */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-drawer-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="mobile-drawer-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du tiroir avec Logo et bouton Fermer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div className="sidebar-logo" style={{ marginBottom: 0 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, var(--color-gold) 0%, #B88E1F 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-navy)',
                  fontWeight: '900',
                  fontSize: '17px',
                  boxShadow: '0 4px 10px rgba(212, 167, 44, 0.25)'
                }}>
                  P
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '19px', fontWeight: '900', color: 'var(--color-navy)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                    PlacePro
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {agency.agency_id === 'admin' ? "👑 Administration PlacePro" : agency.name}
                  </span>
                </div>
              </div>

              {/* Bouton Fermer */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-drawer-close-btn"
                aria-label="Fermer le menu"
                title="Fermer"
              >
                ✕
              </button>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '12px 0 16px 0' }} />

            <MenuNavList 
              isMobile={true} 
              onOpenLogoutConfirm={() => setIsConfirmLogoutOpen(true)} 
            />
          </div>
        </div>
      )}

      {/* 3. Boîte de Dialogue de Confirmation de Déconnexion */}
      {isConfirmLogoutOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 17, 40, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px'
          }}
          onClick={() => setIsConfirmLogoutOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px 24px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              textAlign: 'center',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Avatar rond officiel (IN, AD, etc.) */}
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'var(--color-gold-gradient)',
              color: 'var(--color-navy)',
              fontWeight: '900',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: '0 4px 14px rgba(212, 167, 44, 0.35)'
            }}>
              {agency.logoInitials}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', margin: '0 0 6px 0' }}>
              Se déconnecter ?
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '0 0 22px 0' }}>
              Voulez-vous vraiment vous déconnecter de votre espace <strong>« {agency.name} »</strong> ?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsConfirmLogoutOpen(false)}
                className="btn btn-outline"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="btn"
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '800',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
