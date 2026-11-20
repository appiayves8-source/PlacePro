import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  WalletIcon, 
  ClockIcon, 
  AlertTriangleIcon, 
  ChevronRightIcon,
  CheckCircleIcon,
  BuildingIcon
} from './Icons';

export default function Dashboard() {
  const {
    agency,
    isSuperAdmin,
    candidates,
    clients,
    placements,
    totalCandidates,
    currentlyPlaced,
    moneyToCollectThisMonth,
    contractsEndingThisWeekCount,
    urgentItems,
    unreadNotificationCount,
    setIsNotificationsOpen,
    navigateTo,
    setIsAddCandidateOpen,
    setIsAddClientOpen,
    setIsNewPlacementOpen,
    setIsRecordPaymentOpen,
    openPaymentForPlacement,
    renewPlacement,
    switchToAdminSpace
  } = useApp();

  // Notes de l'agence (vides au départ, ajoutées par la gérante)
  const [notes, setNotes] = useState([]);

  const toggleNote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, completed: !n.completed } : n));
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Mercredi 17

  const daysOfWeek = [
    { name: 'Lu', num: '15' },
    { name: 'Ma', num: '16' },
    { name: 'Me', num: '17' },
    { name: 'Je', num: '18' },
    { name: 'Ve', num: '19' },
    { name: 'Sa', num: '20' },
    { name: 'Di', num: '21' }
  ];

  // Helper pour lien WhatsApp de relance poli
  const getWhatsAppReminderUrl = (phone, candidateName, amount) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour, c'est l'agence ${agency.name}.\n\nNous vous contactons concernant l'échéance de commission de placement pour ${candidateName}.\n\nLe montant restant de ${Number(amount).toLocaleString('fr-FR')} FCFA est actuellement en attente de règlement.\n\nVous pouvez effectuer le règlement par Wave, Orange Money ou MTN Mobile Money sur notre numéro officiel : ${agency.phone}.\n\nMerci de nous transmettre la confirmation dès le transfert effectué. Bonne journée !`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="dashboard-wrapper">
      {/* Bandeau d'assistance actif UNIQUEMENT quand le Super Admin inspecte une agence spécifique */}
      {isSuperAdmin && agency.agency_id !== 'admin' && (
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1.5px solid #3B82F6',
          borderRadius: '16px',
          padding: '12px 18px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>🛠️</span>
            <div>
              <div style={{ color: '#1E3A8A', fontSize: '13.5px', fontWeight: '800' }}>
                Mode Assistance : Vous dépannez l'agence « {agency.name} » ({agency.neighborhood || agency.city})
              </div>
              <div style={{ color: '#2563EB', fontSize: '11.5px', marginTop: '1px' }}>
                Vous visualisez l'espace privé de cette agence. Vous pouvez régler ses soucis puis revenir à votre Espace Admin.
              </div>
            </div>
          </div>
          <button
            onClick={switchToAdminSpace}
            className="btn"
            style={{
              backgroundColor: 'var(--color-navy)',
              color: 'var(--color-gold)',
              border: '1.5px solid var(--color-gold)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            ← Revenir à mon Espace Admin
          </button>
        </div>
      )}

      {/* ========================================================
          1. HERO BANNER : BLEU NUIT (#0E1A3A) ET OR (#D4A72C)
          ======================================================== */}
      <section className="hero-banner">
        <div className="hero-header">
          <div>
            <div className="hero-date-badge">
              <span>{isSuperAdmin && agency?.agency_id === 'admin' ? '👑 Espace Administrateur Plateforme' : '🏢 Espace Agence Partenaire'}</span>
              <span>•</span>
              <span>Abidjan, Côte d'Ivoire</span>
            </div>
            <h1 className="hero-title">
              {isSuperAdmin && agency?.agency_id === 'admin' ? "Bonjour Cyrille (Super Administrateur)," : `Bonjour ! ${agency?.name || ''},`}
            </h1>
            <p className="hero-subtitle">
              {isSuperAdmin && agency?.agency_id === 'admin' 
                ? "Supervision générale de la plateforme PlacePro et de l'ensemble des agences" 
                : "Suivi en temps réel de votre personnel placé et de vos encaissements"}
            </p>
          </div>

          <div className="hero-actions">
            <button 
              onClick={() => setIsNewPlacementOpen(true)}
              className="btn-hero-gold"
            >
              <span>+ Nouveau Placement</span>
            </button>

            <button 
              onClick={() => setIsRecordPaymentOpen(true)}
              className="btn-hero-outline"
            >
              <span>+ Encaisser</span>
            </button>
          </div>
        </div>

        {/* Ruban de capsules statistiques avec chiffres en Or */}
        <div className="hero-stat-ribbon">
          <div className="hero-stat-pill" onClick={() => navigateTo('candidates')}>
            <UsersIcon size={16} color="var(--color-gold)" />
            <span><strong className="hero-stat-strong">{totalCandidates}</strong> Candidats au total</span>
          </div>

          <div className="hero-stat-pill" onClick={() => navigateTo('placements')}>
            <CheckCircleIcon size={16} color="#86EFAC" />
            <span><strong className="hero-stat-strong" style={{ color: '#86EFAC' }}>{currentlyPlaced}</strong> Placés en poste</span>
          </div>

          <div className="hero-stat-pill" onClick={() => navigateTo('money')}>
            <WalletIcon size={16} color="var(--color-gold)" />
            <span><strong className="hero-stat-strong">{moneyToCollectThisMonth.toLocaleString('fr-FR')} FCFA</strong> à récupérer</span>
          </div>

          <div className="hero-stat-pill alert-pill" onClick={() => navigateTo('placements')}>
            <ClockIcon size={16} color="#FCA5A5" />
            <span><strong className="hero-stat-strong">{contractsEndingThisWeekCount}</strong> Fin de contrat cette semaine</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. BARRE D'ACTIONS RAPIDES OPÉRATIONNELLES (4 BOUTONS)
          ======================================================== */}
      <section className="quick-actions-bar">
        {/* Action 1 : Famille / Client */}
        <div 
          className="quick-action-card"
          onClick={() => setIsAddClientOpen(true)}
          title="Enregistrer une nouvelle famille ou entreprise cliente"
        >
          <div className="quick-action-icon" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <BuildingIcon size={18} />
          </div>
          <div>
            <div className="quick-action-label">+ Famille / Client</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Enregistrer employeur</div>
          </div>
        </div>

        {/* Action 2 : Candidat */}
        <div 
          className="quick-action-card"
          onClick={() => setIsAddCandidateOpen(true)}
          title="Ajouter un profil avec garant et consentement"
        >
          <div className="quick-action-icon" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
            <UsersIcon size={18} />
          </div>
          <div>
            <div className="quick-action-label">+ Candidat</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Personnel disponible</div>
          </div>
        </div>

        {/* Action 3 : Nouveau Placement */}
        <div 
          className="quick-action-card"
          onClick={() => setIsNewPlacementOpen(true)}
          title="Associer un candidat à une famille"
        >
          <div className="quick-action-icon" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <BriefcaseIcon size={18} />
          </div>
          <div>
            <div className="quick-action-label">+ Placement</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Nouveau contrat</div>
          </div>
        </div>

        {/* Action 4 : Encaisser un Paiement */}
        <div 
          className="quick-action-card"
          onClick={() => setIsRecordPaymentOpen(true)}
          title="Enregistrer un versement Wave, Orange Money, MTN ou Espèces"
        >
          <div className="quick-action-icon" style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-gold)' }}>
            <WalletIcon size={18} />
          </div>
          <div>
            <div className="quick-action-label">+ Encaisser</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Générer reçu officiel</div>
          </div>
        </div>
      </section>

      {/* BANNIÈRE D'ALERTE : SIGNALEMENTS EN COURS (EMPLOYÉS / FAMILLES) */}
      {unreadNotificationCount > 0 && (
        <div 
          onClick={() => setIsNotificationsOpen(true)}
          style={{
            backgroundColor: '#FEF2F2',
            border: '1.5px solid #F87171',
            borderRadius: '16px',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '900'
            }}>
              🚨
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#991B1B' }}>
                {unreadNotificationCount} nouveau{unreadNotificationCount > 1 ? 'x' : ''} signalement{unreadNotificationCount > 1 ? 's' : ''} d'urgence reçu{unreadNotificationCount > 1 ? 's' : ''} !
              </div>
              <div style={{ fontSize: '12px', color: '#B91C1C', marginTop: '2px' }}>
                Une famille ou un employé a déposé un signalement. Cliquez pour lire et répondre via WhatsApp.
              </div>
            </div>
          </div>

          <button 
            className="btn"
            style={{
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '700',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            Consulter les alertes ({unreadNotificationCount}) →
          </button>
        </div>
      )}

      {/* ========================================================
          3. GRILLE DU CONTENU PRINCIPAL
          ======================================================== */}
      <div className="content-grid">
        
        {/* CARTE DES PRIORITÉS AVEC ACTIONS DIRECTES (Style Mondays) */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)'
              }}>
                <AlertTriangleIcon size={16} />
              </div>
              <h2 className="card-main-title">À traiter en priorité</h2>
              <span style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                {urgentItems.length} actions
              </span>
            </div>

            <button onClick={() => navigateTo('candidates')} className="card-see-all">
              Voir tout l'annuaire →
            </button>
          </div>

          <div className="projects-table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Candidat / Métier</th>
                  <th>Employeur Assigné</th>
                  <th>Montant & Échéance</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Action Directe</th>
                </tr>
              </thead>
              <tbody>
                {urgentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                      <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--color-navy)' }}>
                        Aucune alerte urgente pour le moment
                      </div>
                      <div style={{ fontSize: '12.5px', marginTop: '4px' }}>
                        Tous vos contrats, règlements et suivis de personnel sont à jour.
                      </div>
                    </td>
                  </tr>
                ) : (
                  urgentItems.map(item => {
                    const isLate = item.type === 'late_payment';
                    const isDisp = item.type === 'disappearance';

                    return (
                      <tr key={item.id} className="clickable-row">
                        <td onClick={() => navigateTo(item.actionScreen, item.targetId)}>
                          <div className="task-cell">
                            <div className="task-icon-box" style={{
                              backgroundColor: isDisp ? '#FEE2E2' : isLate ? '#FEE2E2' : '#FEF3C7',
                              color: isDisp ? '#B91C1C' : isLate ? '#DC2626' : '#D97706'
                            }}>
                              {isDisp || isLate ? <AlertTriangleIcon size={18} /> : <ClockIcon size={18} />}
                            </div>
                            <div>
                              <div className="task-name-text">{item.title}</div>
                              <div className="task-sub-info">
                                <span>{item.description}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td onClick={() => navigateTo(item.actionScreen, item.targetId)}>
                          <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569' }}>
                            {item.dueDate ? `Échéance : ${item.dueDate}` : '—'}
                          </span>
                        </td>
                        <td onClick={() => navigateTo(item.actionScreen, item.targetId)}>
                          <div style={{ fontWeight: '800', color: isLate ? '#DC2626' : 'var(--color-navy)', fontSize: '13px' }}>
                            {item.title.includes('FCFA') ? item.title.split(':')[1] : '—'}
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${item.badgeColor.includes('red') ? 'status-pill-red' : 'status-pill-amber'}`}>
                            {item.badgeText}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => navigateTo(item.actionScreen, item.targetId)}
                            className="btn-table-action btn-table-gold"
                          >
                            Consulter →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LIGNE INFÉRIEURE : ÉCHÉANCIER DE LA SEMAINE & NOTES */}
        <div className="bottom-split-row">
          
          {/* CARTE GAUCHE : ÉCHÉANCIER DE LA SEMAINE */}
          <div className="dashboard-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <h3 className="card-main-title">Échéancier de la semaine</h3>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-gold)' }}>Novembre 2026</span>
            </div>

            {/* Sélecteur de jours */}
            <div className="schedule-days-row">
              {daysOfWeek.map((day, idx) => (
                <div 
                  key={idx}
                  className={`schedule-day-item ${idx === selectedDayIndex ? 'active' : ''}`}
                  onClick={() => setSelectedDayIndex(idx)}
                >
                  <span className="day-name">{day.name}</span>
                  <span className="day-number">{day.num}</span>
                </div>
              ))}
            </div>

            {/* Événements avec liseré de couleur */}
            <div className="schedule-events-list">
              {placements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 12px', color: '#64748B' }}>
                  <p style={{ margin: 0, fontSize: '13px' }}>Aucune échéance de contrat ou de paiement cette semaine.</p>
                </div>
              ) : (
                placements.slice(0, 3).map(plc => {
                  const cand = candidates.find(c => c.id === plc.candidateId);
                  const client = clients.find(cl => cl.id === plc.clientId);
                  const initials = cand ? `${cand.firstName[0] || ''}${cand.lastName[0] || ''}`.toUpperCase() : 'CD';

                  return (
                    <div 
                      key={plc.id}
                      className="schedule-event-item accent-blue"
                      onClick={() => navigateTo('placements')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="event-info">
                        <h4>Placement : {cand ? `${cand.firstName} ${cand.lastName}` : 'Personnel'}</h4>
                        <p>Fin de contrat : {plc.endDate} • {client?.name || 'Famille'}</p>
                      </div>
                      <div className="assign-avatar" style={{ width: '28px', height: '28px', fontSize: '10px' }}>
                        {initials}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CARTE DROITE : NOTES & MÉMOS AGENCE */}
          <div className="dashboard-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <h3 className="card-main-title">Notes & Mémos de l'Agence</h3>
              </div>
              <button 
                onClick={() => {
                  const text = prompt("Ajouter une note rapide pour l'agence :");
                  if (text) {
                    setNotes([{ id: Date.now(), title: text, detail: "Ajouté aujourd'hui", completed: false }, ...notes]);
                  }
                }}
                className="btn-table-action btn-table-gold"
                style={{ padding: '4px 10px', fontSize: '11px', minHeight: '30px' }}
              >
                + Note
              </button>
            </div>

            {/* Liste de cases à cocher */}
            <div className="notes-list">
              {notes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 12px', color: '#64748B' }}>
                  <p style={{ margin: 0, fontSize: '13px' }}>Aucun mémo pour le moment. Cliquez sur « + Note » pour en créer un.</p>
                </div>
              ) : (
                notes.map(note => (
                  <div 
                    key={note.id} 
                    className={`note-item ${note.completed ? 'completed' : ''}`}
                    onClick={() => toggleNote(note.id)}
                  >
                    <div className={`note-checkbox ${note.completed ? 'checked' : ''}`}>
                      {note.completed && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <div className="note-content">
                      <h4>{note.title}</h4>
                      <p>{note.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
