import React from 'react';
import { useApp } from '../context/AppContext';

export default function TopBar() {
  const {
    agency,
    agencies,
    isSuperAdmin,
    currentScreen,
    switchAgency,
    navigateTo,
    urgentItems,
    unreadNotificationCount,
    setIsNotificationsOpen,
    setIsAddCandidateOpen,
    setIsAddClientOpen,
    setIsMobileMenuOpen,
    isStandalone,
    installApp
  } = useApp();

  return (
    <header className="topbar">
      {/* Sélecteur d'espace agence & Recherche */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '640px' }}>
        {/* Bouton Hamburger Menu Mobile (< 900px) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="mobile-menu-toggle-btn"
          aria-label="Ouvrir le menu du dashboard"
          title="Menu principal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* La "Cage" : STRICTEMENT RÉSERVÉE au Super Administrateur */}
        {isSuperAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={agency?.agency_id || 'admin'}
              onChange={(e) => switchAgency(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: agency?.agency_id === 'admin' ? '1.5px solid var(--color-gold)' : '1.5px solid #3B82F6',
                backgroundColor: agency?.agency_id === 'admin' ? '#FAF5EA' : '#EFF6FF',
                color: 'var(--color-navy)',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                minWidth: '200px',
                maxWidth: '240px',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
              title="Cage des espaces : Choisissez votre espace Admin ou une agence à inspecter"
            >
              <option value="admin">👑 Mon Espace Admin (Cyrille)</option>
              {agencies.length > 0 && (
                <optgroup label="── Espaces Agences créés ──">
                  {agencies.map(ag => (
                    <option key={ag.agency_id} value={ag.agency_id}>
                      🏢 {ag.name} ({ag.neighborhood || ag.city})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        ) : (
          /* Badge fixe pour l'agence cliente (Aucune visibilité sur les concurrents) */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FAF5EA',
            border: '1.5px solid var(--color-gold)',
            padding: '7px 14px',
            borderRadius: '10px',
            color: 'var(--color-navy)',
            fontSize: '13px',
            fontWeight: '800',
            whiteSpace: 'nowrap'
          }}>
            <span>🏢</span>
            <span>{agency?.name || 'Mon Espace Agence'}</span>
            {agency?.neighborhood && (
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                • {agency.neighborhood}
              </span>
            )}
          </div>
        )}

        {/* Bouton Super Admin : STRICTEMENT RÉSERVÉ au Super Administrateur */}
        {isSuperAdmin && (
          <button
            onClick={() => navigateTo('super-admin')}
            className="btn"
            style={{
              minHeight: '38px',
              padding: '6px 14px',
              fontSize: '12px',
              borderRadius: '10px',
              backgroundColor: currentScreen === 'super-admin' ? 'var(--color-gold)' : 'var(--color-navy)',
              color: currentScreen === 'super-admin' ? 'var(--color-navy)' : 'var(--color-gold)',
              border: '1.5px solid var(--color-gold)',
              fontWeight: '900',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(14, 26, 58, 0.15)'
            }}
            title="Ouvrir la Console Super Admin (Création d'agences, gestion des abonnements, Wave)"
          >
            <span>👑</span>
            <span>Super Admin</span>
          </button>
        )}

        {/* Barre de recherche */}
        <div className="search-input-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un candidat, client ou quartier..."
            className="search-input"
          />
        </div>
      </div>

      {/* Actions à droite */}
      <div className="topbar-actions">
        {/* Bouton d'installation de l'application (Masqué si l'application est déjà installée en mode standalone) */}
        {!isStandalone && (
          <button
            onClick={installApp}
            className="topbar-install-btn"
            title="Installer l'application PlacePro sur votre téléphone ou ordinateur"
            type="button"
          >
            <span style={{ fontSize: '15px' }}>📲</span>
            <span className="install-btn-text">Installer l'App</span>
          </button>
        )}

        <button
          onClick={() => setIsAddClientOpen(true)}
          className="btn btn-outline topbar-btn-family"
          style={{
            minHeight: '38px',
            padding: '6px 12px',
            fontSize: '12px',
            borderRadius: '10px',
            color: 'var(--color-navy)',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            backgroundColor: '#F8FAFC'
          }}
        >
          + Famille
        </button>

        <button
          onClick={() => setIsAddCandidateOpen(true)}
          className="topbar-btn-new"
        >
          <span>+ Candidat</span>
        </button>

        {/* Cloche d'alertes & Signalements Employés / Familles */}
        <div
          onClick={() => setIsNotificationsOpen(true)}
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--color-navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease'
          }}
          title={`${unreadNotificationCount} signalement(s) non lu(s)`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {unreadNotificationCount > 0 ? (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              minWidth: '18px',
              height: '18px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: '900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
            }}>
              {unreadNotificationCount}
            </span>
          ) : (
            urgentItems.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--color-gold)',
                borderRadius: '50%'
              }} />
            )
          )}
        </div>
      </div>
    </header>
  );
}
