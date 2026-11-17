import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  ChevronRightIcon 
} from './Icons';

export default function CandidatesView() {
  const { candidates, navigateTo, setIsAddCandidateOpen, agency } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'disponible' | 'placé' | 'disparu'
  const [jobFilter, setJobFilter] = useState('all');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('all');

  const jobsList = Array.from(new Set([
    'Nounou',
    'Aide-ménagère',
    'Chauffeur',
    'Gardien',
    'Cuisinière',
    'Baby-sitter',
    ...candidates.map(c => c.job).filter(Boolean)
  ]));

  const neighborhoodsList = [
    'Cocody',
    'Cocody Angré',
    'Marcory',
    'Marcory Zone 4',
    'Yopougon',
    'Plateau',
    'Abobo',
    'Koumassi'
  ];

  // Filtrage dynamique
  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      // Recherche textuelle
      const fullName = `${cand.firstName} ${cand.lastName}`.toLowerCase();
      const job = (cand.job || '').toLowerCase();
      const neigh = (cand.neighborhood || '').toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch = !query || fullName.includes(query) || job.includes(query) || neigh.includes(query);

      // Filtre statut
      const matchesStatus = statusFilter === 'all' || cand.status === statusFilter;

      // Filtre métier
      const matchesJob = jobFilter === 'all' || cand.job === jobFilter;

      // Filtre quartier
      const matchesNeighborhood = neighborhoodFilter === 'all' || (cand.neighborhood || '').includes(neighborhoodFilter);

      return matchesSearch && matchesStatus && matchesJob && matchesNeighborhood;
    });
  }, [candidates, searchTerm, statusFilter, jobFilter, neighborhoodFilter]);

  // Helpers pour les scores
  const getScoreInfo = (score) => {
    if (score >= 80) {
      return {
        label: 'Fiable',
        badgeClass: 'score-fiable',
        color: '#15803D',
        bg: '#DCFCE7',
        border: '#86EFAC'
      };
    }
    if (score >= 50) {
      return {
        label: 'Attention',
        badgeClass: 'score-attention',
        color: '#C2410C',
        bg: '#FFEDD5',
        border: '#FDBA74'
      };
    }
    return {
      label: 'Risqué',
      badgeClass: 'score-risque',
      color: '#B91C1C',
      bg: '#FEE2E2',
      border: '#FCA5A5'
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'disponible':
        return { label: 'Disponible', bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' };
      case 'placé':
        return { label: 'Placé en poste', bg: '#DCFCE7', color: '#166534', border: '#86EFAC' };
      case 'disparu':
        return { label: 'Signalé Disparu', bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' };
      default:
        return { label: status, bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
    }
  };

  return (
    <div className="candidates-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ========================================================
          1. EN-TÊTE CHIC DE LA SECTION CANDIDATS
          ======================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, #162955 100%)',
        borderRadius: '20px',
        padding: '28px 24px',
        color: '#FFFFFF',
        marginBottom: '24px',
        border: '1px solid rgba(212, 167, 44, 0.3)',
        boxShadow: '0 10px 25px -5px rgba(14, 26, 58, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--color-gold)',
              backgroundColor: 'rgba(212, 167, 44, 0.15)',
              border: '1px solid rgba(212, 167, 44, 0.3)',
              padding: '4px 10px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              <span>Annuaire Officiel du Personnel</span>
              <span>•</span>
              <span>{agency.name}</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
              Personnel Enregistré ({candidates.length})
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', maxWidth: '540px' }}>
              Chaque profil dispose d'une identité vérifiée, d'un garant obligatoire et d'un score de confiance certifié.
            </p>
          </div>

          <button
            onClick={() => setIsAddCandidateOpen(true)}
            className="btn"
            style={{
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-navy)',
              fontWeight: '700',
              fontSize: '13px',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(212, 167, 44, 0.3)'
            }}
          >
            + Ajouter un Candidat
          </button>
        </div>

        {/* Mini statistiques d'effectif */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Disponibles : <strong style={{ color: '#93C5FD' }}>{candidates.filter(c => c.status === 'disponible').length}</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            En poste : <strong style={{ color: '#86EFAC' }}>{candidates.filter(c => c.status === 'placé').length}</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Fiables (Score 80+) : <strong style={{ color: 'var(--color-gold)' }}>{candidates.filter(c => c.trustScore >= 80).length}</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Signalés Disparus : <strong style={{ color: '#FCA5A5' }}>{candidates.filter(c => c.status === 'disparu').length}</strong>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. BARRE DE RECHERCHE ET FILTRES ÉLÉGANTS
          ======================================================== */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Ligne 1 : Barre de recherche principale */}
        <div style={{ position: 'relative', width: '100%' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '12px', color: '#94A3B8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, métier ou commune..."
            style={{
              width: '100%',
              height: '44px',
              padding: '10px 40px 10px 42px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              fontSize: '13px',
              color: 'var(--color-navy)',
              backgroundColor: '#F8FAFC',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Ligne 2 : Filtres de statut & Métiers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Boutons pilules de statut */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: statusFilter === 'all' ? 'var(--color-navy)' : '#FFFFFF',
                color: statusFilter === 'all' ? '#FFFFFF' : 'var(--color-text-muted)',
                borderColor: statusFilter === 'all' ? 'var(--color-navy)' : '#E2E8F0',
                transition: 'all 0.15s ease'
              }}
            >
              Tous ({candidates.length})
            </button>

            <button
              onClick={() => setStatusFilter('disponible')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: statusFilter === 'disponible' ? '#1E40AF' : '#FFFFFF',
                color: statusFilter === 'disponible' ? '#FFFFFF' : '#1E40AF',
                borderColor: statusFilter === 'disponible' ? '#1E40AF' : '#DBEAFE',
                transition: 'all 0.15s ease'
              }}
            >
              Disponibles ({candidates.filter(c => c.status === 'disponible').length})
            </button>

            <button
              onClick={() => setStatusFilter('placé')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: statusFilter === 'placé' ? '#15803D' : '#FFFFFF',
                color: statusFilter === 'placé' ? '#FFFFFF' : '#15803D',
                borderColor: statusFilter === 'placé' ? '#15803D' : '#DCFCE7',
                transition: 'all 0.15s ease'
              }}
            >
              En poste ({candidates.filter(c => c.status === 'placé').length})
            </button>

            <button
              onClick={() => setStatusFilter('disparu')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: statusFilter === 'disparu' ? '#B91C1C' : '#FFFFFF',
                color: statusFilter === 'disparu' ? '#FFFFFF' : '#B91C1C',
                borderColor: statusFilter === 'disparu' ? '#B91C1C' : '#FEE2E2',
                transition: 'all 0.15s ease'
              }}
            >
              Disparus ({candidates.filter(c => c.status === 'disparu').length})
            </button>
          </div>

          {/* Menus déroulants Métier et Commune */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--color-navy)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Tous les métiers</option>
              {jobsList.map(j => <option key={j} value={j}>{j}</option>)}
            </select>

            <select
              value={neighborhoodFilter}
              onChange={(e) => setNeighborhoodFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--color-navy)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Toutes communes</option>
              {neighborhoodsList.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. GRILLE DE CARTES CANDIDATS HAUT DE GAMME
          ======================================================== */}
      {candidates.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          border: '1.5px dashed #CBD5E1'
        }}>
          <div style={{ fontSize: '44px', marginBottom: '14px' }}>👥</div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Aucun personnel pour l'instant
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Votre agence n'a pas encore enregistré de personnel. Ajoutez votre première nounou, cuisinière ou chauffeur pour commencer.
          </p>
          <button
            onClick={() => setIsAddCandidateOpen(true)}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>+</span>
            <span>Ajouter du personnel</span>
          </button>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px dashed #CBD5E1'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)' }}>
            Aucun candidat ne correspond à votre recherche
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Essayez de modifier vos filtres ou d'enregistrer un nouveau profil.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setJobFilter('all'); setNeighborhoodFilter('all'); }}
            className="btn btn-outline"
            style={{ marginTop: '16px' }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {filteredCandidates.map(cand => {
            const scoreInfo = getScoreInfo(cand.trustScore);
            const statusInfo = getStatusBadge(cand.status);
            const initials = `${cand.firstName[0] || ''}${cand.lastName[0] || ''}`.toUpperCase();

            return (
              <div
                key={cand.id}
                onClick={() => navigateTo('candidate-detail', cand.id)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: cand.status === 'disparu' ? '1.5px solid #FCA5A5' : '1px solid var(--color-border)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease-in-out',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(14, 26, 58, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--color-gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = cand.status === 'disparu' ? '#FCA5A5' : 'var(--color-border)';
                }}
              >
                {/* Haut de carte : Avatar, Nom, Métier, Badge Score */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Avatar monogramme avec anneau doré */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: cand.status === 'disparu' 
                          ? 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)'
                          : 'linear-gradient(135deg, var(--color-navy) 0%, #1A2E5E 100%)',
                        color: cand.status === 'disparu' ? '#FFFFFF' : 'var(--color-gold)',
                        fontWeight: '900',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #FFFFFF'
                      }}>
                        {initials}
                      </div>

                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)', margin: 0, lineHeight: 1.2 }}>
                          {cand.firstName} {cand.lastName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span style={{
                            backgroundColor: 'var(--color-gold-light)',
                            color: '#92400E',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-gold-border)'
                          }}>
                            {cand.job}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            • {cand.neighborhood}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badge Score de Confiance Certifié (mot + couleur) */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end'
                    }}>
                      <div style={{
                        backgroundColor: scoreInfo.bg,
                        color: scoreInfo.color,
                        border: `1px solid ${scoreInfo.border}`,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '0.2px'
                      }}>
                        {scoreInfo.label}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: scoreInfo.color, marginTop: '2px' }}>
                        {cand.trustScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Alerte si disparition */}
                  {cand.status === 'disparu' && (
                    <div style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      marginBottom: '12px',
                      fontSize: '11px',
                      color: '#991B1B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <AlertTriangleIcon size={14} color="#DC2626" />
                      <strong>Signalement actif :</strong> {cand.disappearanceDetails?.reason || 'Abandon de poste'}
                    </div>
                  )}

                  {/* Détails financiers & Statut */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Prétention salaire</span>
                      <strong style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-navy)' }}>
                        {cand.desiredSalary.toLocaleString('fr-FR')} <span style={{ fontSize: '10px' }}>FCFA/mois</span>
                      </strong>
                    </div>

                    <div>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Garant & Consentement */}
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--color-navy)', fontWeight: '700' }}>Garant :</span>
                      <span>{cand.guarantor?.name || 'Non renseigné'} ({cand.guarantor?.relation || 'Lien'})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#166534' }}>
                      <span>✓ Accord de consentement enregistré</span>
                    </div>
                  </div>
                </div>

                {/* Bas de carte : Bouton chic pour ouvrir la fiche */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--color-navy)',
                  fontWeight: '700',
                  fontSize: '13px'
                }}>
                  <span>Consulter la fiche complète</span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-navy)',
                    color: 'var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ChevronRightIcon size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
