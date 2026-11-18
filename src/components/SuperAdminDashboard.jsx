import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BuildingIcon, WalletIcon, UsersIcon, CheckCircleIcon, AlertTriangleIcon } from './Icons';
import { ADMIN_CONFIG, formatWhatsAppPhone } from '../config/adminConfig';

export default function SuperAdminDashboard() {
  const { 
    agencies, 
    superAdminPayments, 
    extendAgencySubscription, 
    grantTrialExtension, 
    toggleAgencyLock, 
    switchAgency,
    setIsCreateAgencyOpen, 
    navigateTo 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'warning' | 'expired' | 'trial'
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);

  // Calcul des métriques financières et opérationnelles Super Admin
  const totalAgencies = agencies.length;
  
  const mrr = agencies.reduce((sum, ag) => {
    return sum + (ag.subscriptionStatus !== 'expired' ? (ag.monthlyFee || 0) : 0);
  }, 0);

  const totalCollectedByAdmin = superAdminPayments.reduce((sum, pay) => sum + (Number(pay.amount) || 0), 0);

  const pendingCollection = agencies
    .filter(ag => ag.subscriptionStatus === 'warning' || ag.subscriptionStatus === 'expired')
    .reduce((sum, ag) => sum + (ag.monthlyFee || 39000), 0);

  // Filtrage des agences
  const filteredAgencies = useMemo(() => {
    return agencies.filter(ag => {
      const name = (ag.name || '').toLowerCase();
      const manager = (ag.managerName || '').toLowerCase();
      const neighborhood = (ag.neighborhood || '').toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || manager.includes(query) || neighborhood.includes(query);
      const matchesStatus = statusFilter === 'all' || ag.subscriptionStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [agencies, searchTerm, statusFilter]);

  // WhatsApp de relance poli pour l'abonnement
  const getWhatsAppRenewalReminder = (agency) => {
    const cleanPhone = formatWhatsAppPhone(agency.phone);
    const fee = (agency.monthlyFee || 39000).toLocaleString('fr-FR');
    const expiry = new Date(agency.subscriptionExpiry || Date.now()).toLocaleDateString('fr-FR');
    
    const message = encodeURIComponent(
      `Bonjour ${agency.managerName || agency.name}, c'est Cyrille de PlacePro.\n\nNous faisons le point sur l'abonnement de votre espace *« ${agency.name} »*.\n\nVotre abonnement arrive à échéance le *${expiry}* (Montant : *${fee} FCFA*).\n\nPour continuer à suivre vos placements et votre personnel sans coupure, vous pouvez effectuer votre transfert Wave ou Orange Money sur notre numéro officiel : ${ADMIN_CONFIG.phoneFormatted}.\n\nMerci de votre confiance et bonne journée !`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const handleExtend = (agencyId, name) => {
    extendAgencySubscription(agencyId, 30, 'Wave Business');
    setActionFeedback(`Abonnement prolongé de 30 jours pour ${name} ! Règlement Wave enregistré.`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleTrial = (agencyId, name) => {
    grantTrialExtension(agencyId, 7);
    setActionFeedback(`Extension de 7 jours accordée pour ${name}.`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* ========================================================
          1. HERO BANNER : CONSOLE SUPER ADMIN (Bleu Nuit Profond & Or)
          ======================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #162447 100%)',
        borderRadius: '24px',
        padding: '30px 26px',
        color: '#FFFFFF',
        marginBottom: '24px',
        border: '1.5px solid rgba(212, 167, 44, 0.4)',
        boxShadow: '0 15px 30px -10px rgba(10, 17, 40, 0.35)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--color-gold)',
              backgroundColor: 'rgba(212, 167, 44, 0.15)',
              border: '1px solid rgba(212, 167, 44, 0.35)',
              padding: '4px 12px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px'
            }}>
              <span>👑 ESPACE SUPER ADMIN</span>
              <span>•</span>
              <span>SUPERVISION PLATEFORME</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
              Gestion des Agences & Abonnements PlacePro
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px', maxWidth: '620px', lineHeight: 1.5 }}>
              Pilotez l'ensemble des agences clientes en Côte d'Ivoire, suivez le statut de leurs abonnements en temps réel et validez leurs règlements Mobile Money.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsCreateAgencyOpen(true)}
              className="btn"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-navy)',
                fontWeight: '800',
                fontSize: '13px',
                padding: '10px 18px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(212, 167, 44, 0.3)'
              }}
            >
              + Inscrire une Nouvelle Agence
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className="btn btn-outline"
              style={{
                borderColor: '#CBD5E1',
                color: '#FFFFFF',
                fontSize: '13px',
                padding: '10px 16px',
                borderRadius: '12px'
              }}
            >
              ← Retour au Dashboard
            </button>
          </div>
        </div>

        {/* 4 Chiffres Clés du Business PlacePro (KPIs) */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '11px', color: '#CBD5E1', textTransform: 'uppercase', fontWeight: '700' }}>Revenus Récurrents (MRR)</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-gold)', marginTop: '4px' }}>
              {mrr.toLocaleString('fr-FR')} FCFA
            </div>
            <div style={{ fontSize: '11px', color: '#86EFAC', marginTop: '2px' }}>Abonnements mensuels actifs</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '11px', color: '#CBD5E1', textTransform: 'uppercase', fontWeight: '700' }}>Agences Partenaires</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF', marginTop: '4px' }}>
              {totalAgencies} agences
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Abidjan (Cocody, Marcory, Plateau...)</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '11px', color: '#CBD5E1', textTransform: 'uppercase', fontWeight: '700' }}>À Récupérer ce mois</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#FCA5A5', marginTop: '4px' }}>
              {pendingCollection.toLocaleString('fr-FR')} FCFA
            </div>
            <div style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '2px' }}>Échéances proches & retards</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '11px', color: '#CBD5E1', textTransform: 'uppercase', fontWeight: '700' }}>Total Encaissé PlacePro</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#86EFAC', marginTop: '4px' }}>
              {totalCollectedByAdmin.toLocaleString('fr-FR')} FCFA
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>Historique Mobile Money validé</div>
          </div>
        </div>
      </div>

      {/* Alerte de retour d'action Super Admin */}
      {actionFeedback && (
        <div style={{
          backgroundColor: '#DCFCE7',
          border: '1.5px solid #86EFAC',
          borderRadius: '12px',
          padding: '12px 18px',
          color: '#15803D',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>✓</span>
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* ========================================================
          2. RECHERCHE ET FILTRES DES STATUTS D'ABONNEMENT
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
        gap: '12px'
      }}>
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher une agence, une gérante ou une commune..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1.5px solid var(--color-border)',
            fontSize: '13px',
            outline: 'none'
          }}
        />

        {/* Filtres de statut */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: statusFilter === 'all' ? 'var(--color-navy)' : '#F1F5F9',
              color: statusFilter === 'all' ? '#FFFFFF' : 'var(--color-navy)'
            }}
          >
            Toutes les Agences ({agencies.length})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: statusFilter === 'active' ? '#15803D' : '#DCFCE7',
              color: statusFilter === 'active' ? '#FFFFFF' : '#15803D'
            }}
          >
            🟢 À jour ({agencies.filter(a => a.subscriptionStatus === 'active').length})
          </button>

          <button
            onClick={() => setStatusFilter('warning')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: statusFilter === 'warning' ? '#C2410C' : '#FFEDD5',
              color: statusFilter === 'warning' ? '#FFFFFF' : '#C2410C'
            }}
          >
            🟡 Échéance proche &lt; 5j ({agencies.filter(a => a.subscriptionStatus === 'warning').length})
          </button>

          <button
            onClick={() => setStatusFilter('expired')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: statusFilter === 'expired' ? '#B91C1C' : '#FEE2E2',
              color: statusFilter === 'expired' ? '#FFFFFF' : '#B91C1C'
            }}
          >
            🔴 Expirées / Bloquées ({agencies.filter(a => a.subscriptionStatus === 'expired' || a.subscriptionStatus === 'suspended').length})
          </button>

          <button
            onClick={() => setStatusFilter('trial')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: statusFilter === 'trial' ? '#1D4ED8' : '#DBEAFE',
              color: statusFilter === 'trial' ? '#FFFFFF' : '#1D4ED8'
            }}
          >
            🔵 Essai gratuit ({agencies.filter(a => a.subscriptionStatus === 'trial').length})
          </button>
        </div>
      </div>

      {/* ========================================================
          3. GRILLE DES AGENCES & SUIVI DES ABONNEMENTS
          ======================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {filteredAgencies.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '44px 20px',
            textAlign: 'center',
            border: '1.5px dashed var(--color-border)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>🏢</div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '8px' }}>
              {agencies.length === 0 ? "Aucune agence créée pour l'instant" : "Aucune agence ne correspond à ce filtre"}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '440px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
              {agencies.length === 0 
                ? "En tant que Super Administrateur (Cyrille), vous pouvez inscrire votre première agence partenaire. Elle sera immédiatement synchronisée dans Supabase."
                : "Essayez de modifier votre recherche ou de réinitialiser le filtre de statut."
              }
            </p>
            {agencies.length === 0 && (
              <button
                onClick={() => setIsCreateAgencyOpen(true)}
                className="btn"
                style={{
                  backgroundColor: 'var(--color-gold)',
                  color: 'var(--color-navy)',
                  fontWeight: '800',
                  padding: '12px 22px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(212, 167, 44, 0.3)'
                }}
              >
                + Inscrire ma première agence
              </button>
            )}
          </div>
        ) : (
          filteredAgencies.map(ag => {
          const isExpired = ag.subscriptionStatus === 'expired' || ag.subscriptionStatus === 'suspended';
          const isWarning = ag.subscriptionStatus === 'warning';
          const isTrial = ag.subscriptionStatus === 'trial';
          const isActive = ag.subscriptionStatus === 'active';

          return (
            <div
              key={ag.agency_id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 24px',
                border: `1.5px solid ${isExpired ? '#FCA5A5' : isWarning ? '#FDBA74' : 'var(--color-border)'}`,
                boxShadow: isExpired ? '0 4px 12px rgba(220, 38, 38, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Ligne 1 : Nom, Logo, Gérante et Badge de statut */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: isExpired
                      ? 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)'
                      : 'linear-gradient(135deg, var(--color-navy) 0%, #162955 100%)',
                    color: isExpired ? '#FFFFFF' : 'var(--color-gold)',
                    fontWeight: '900',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                  }}>
                    {ag.logoInitials || 'AG'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
                        {ag.name}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                        ID: {ag.agency_id}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                      Gérante : <strong>{ag.managerName || 'Direction'}</strong> • Tél : <strong>{ag.phone}</strong> • 📍 {ag.neighborhood}
                    </div>
                  </div>
                </div>

                {/* Badge Statut Abonnement */}
                <div>
                  {isActive && (
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '800' }}>
                      🟢 À JOUR (Actif)
                    </span>
                  )}
                  {isWarning && (
                    <span style={{ backgroundColor: '#FFEDD5', color: '#C2410C', border: '1px solid #FDBA74', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '800' }}>
                      🟡 ÉCHÉANCE PROCHE (&lt; 5 jours)
                    </span>
                  )}
                  {isExpired && (
                    <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '800' }}>
                      🔴 EXPIRÉ (Accès Bloqué)
                    </span>
                  )}
                  {isTrial && (
                    <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', border: '1px solid #93C5FD', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '800' }}>
                      🔵 ESSAI GRATUIT
                    </span>
                  )}
                </div>
              </div>

              {/* Ligne 2 : Détails de la formule et de l'échéance */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                fontSize: '12px'
              }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Formule souscrite :</span>
                  <strong style={{ color: 'var(--color-navy)', fontSize: '13px' }}>{ag.plan || 'Mensuel Pro'}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Tarif abonnement :</span>
                  <strong style={{ color: 'var(--color-gold)', fontSize: '13px' }}>
                    {(ag.monthlyFee || 25000).toLocaleString('fr-FR')} FCFA / mois
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Date d'échéance :</span>
                  <strong style={{ color: isExpired ? '#DC2626' : isWarning ? '#C2410C' : 'var(--color-navy)', fontSize: '13px' }}>
                    {new Date(ag.subscriptionExpiry || Date.now()).toLocaleDateString('fr-FR')}
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Total payé au Super Admin :</span>
                  <strong style={{ color: '#15803D', fontSize: '13px' }}>
                    {(ag.totalPaidToAdmin || 0).toLocaleString('fr-FR')} FCFA
                  </strong>
                </div>
              </div>

              {/* Ligne 3 : BOUTONS D'ACTIONS OPÉRATIONNELLES DU SUPER ADMIN */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #F1F5F9'
              }}>
                {/* Actions principales à gauche */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Bouton 1 : Encaisser +30 jours Wave */}
                  <button
                    onClick={() => handleExtend(ag.agency_id, ag.name)}
                    className="btn"
                    style={{
                      backgroundColor: '#15803D',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Enregistrer le paiement Mobile Money et prolonger de 30 jours"
                  >
                    <span>⚡</span>
                    <span>+30 Jours (Encaissé Wave)</span>
                  </button>

                  {/* Bouton 2 : Relance WhatsApp */}
                  <a
                    href={getWhatsAppRenewalReminder(ag)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Ouvre WhatsApp avec le message de rappel poli"
                  >
                    <span>💬</span>
                    <span>Relancer sur WhatsApp</span>
                  </a>

                  {/* Bouton 3 : +7 jours essai */}
                  <button
                    onClick={() => handleTrial(ag.agency_id, ag.name)}
                    className="btn btn-outline"
                    style={{ fontSize: '11px', padding: '8px 12px', borderRadius: '8px' }}
                    title="Accorder 7 jours de grâce gratuits"
                  >
                    +7j d'essai
                  </button>

                  {/* Bouton 4 : Bloquer / Débloquer */}
                  <button
                    onClick={() => toggleAgencyLock(ag.agency_id)}
                    style={{
                      backgroundColor: isExpired ? '#FEF2F2' : '#F1F5F9',
                      color: isExpired ? '#DC2626' : '#64748B',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    {isExpired ? '🔓 Débloquer l’accès' : '🔒 Suspendre l’accès'}
                  </button>
                </div>

                {/* Bouton pour se connecter au Dashboard de cette agence */}
                <button
                  onClick={() => switchAgency(ag.agency_id)}
                  className="btn"
                  style={{
                    backgroundColor: 'var(--color-navy)',
                    color: 'var(--color-gold)',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '8px 14px',
                    borderRadius: '8px'
                  }}
                  title="Ouvrir le tableau de bord de cette agence"
                >
                  Accéder à son Dashboard →
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* ========================================================
          4. HISTORIQUE DES ENCAISSEMENTS D'ABONNEMENTS (CYRILLE)
          ======================================================== */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
              Journal des Règlements d'Abonnements Reçus
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Traçabilité complète des encaissements Mobile Money (Wave, Orange Money, MTN)
            </p>
          </div>

          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: '800', fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}>
            {superAdminPayments.length} paiements enregistrés
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-navy)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Agence Cliente</th>
                <th style={{ padding: '10px 12px' }}>Formule</th>
                <th style={{ padding: '10px 12px' }}>Moyen & Référence</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Montant Encaissé</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {superAdminPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                    Aucun encaissement d'abonnement pour l'instant. Les renouvellements Wave et Orange Money s'afficheront ici.
                  </td>
                </tr>
              ) : (
                superAdminPayments.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px' }}>{new Date(p.paymentDate).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-navy)' }}>{p.agencyName}</td>
                    <td style={{ padding: '12px' }}>{p.plan}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontWeight: '700', color: '#1E40AF' }}>{p.method}</span>
                      <span style={{ color: '#94A3B8', fontSize: '11px', display: 'block' }}>Réf: {p.reference}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '800', color: '#15803D' }}>
                      {p.amount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
                        ✓ Validé
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
