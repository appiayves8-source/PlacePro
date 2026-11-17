import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangleIcon, WalletIcon, ChevronRightIcon, CheckCircleIcon } from './Icons';
import ReportDisappearanceModal from './ReportDisappearanceModal';

export default function CandidateDetail() {
  const { 
    candidates, 
    selectedCandidateId, 
    goBack, 
    placements, 
    clients, 
    openPaymentForPlacement,
    getWorkerPortalLink,
    setPortalView,
    setPortalEntityId,
    agency 
  } = useApp();

  const [isDisappearanceModalOpen, setIsDisappearanceModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const candidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  const placement = placements.find(p => p.candidateId === candidate?.id);
  const client = placement ? clients.find(cl => cl.id === placement.clientId) : null;

  if (!candidate) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <p>Candidat introuvable.</p>
        <button onClick={goBack} className="btn btn-navy" style={{ marginTop: '12px' }}>
          ← Retour
        </button>
      </div>
    );
  }

  // Calcul du score
  const getScoreInfo = (score) => {
    if (score >= 80) {
      return { label: 'Fiable', color: '#15803D', bg: '#DCFCE7', border: '#86EFAC' };
    }
    if (score >= 50) {
      return { label: 'Attention', color: '#C2410C', bg: '#FFEDD5', border: '#FDBA74' };
    }
    return { label: 'Risqué', color: '#B91C1C', bg: '#FEE2E2', border: '#FCA5A5' };
  };

  const scoreInfo = getScoreInfo(candidate.trustScore);

  // Calcul des montants de la commission
  const totalCommission = placement?.totalCommission || 0;
  const paidCommission = (placement?.installments || [])
    .filter(i => i.status === 'payé')
    .reduce((sum, i) => sum + i.amount, 0);
  const remainingCommission = Math.max(0, totalCommission - paidCommission);
  const nextInstallment = (placement?.installments || []).find(i => i.status === 'en_retard' || i.status === 'en_attente');

  // WhatsApp relance
  const getWhatsAppReminderUrl = () => {
    const phone = (client?.phone || candidate.phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour, c'est l'agence ${agency.name}.\n\nNous faisons le point sur le contrat de placement de ${candidate.firstName} ${candidate.lastName} (${candidate.job}).\n\nCommission restante : ${remainingCommission.toLocaleString('fr-FR')} FCFA.\n\nMerci de nous contacter pour convenir du règlement par Wave, Orange Money ou MTN. Bonne journée !`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '840px', margin: '0 auto' }}>
      
      {/* ========================================================
          1. CARTE PROFIL SUPÉRIEURE LUXUEUSE (Bleu Nuit & Or)
          ======================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, #162955 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: '#FFFFFF',
        marginBottom: '20px',
        border: '1px solid rgba(212, 167, 44, 0.35)',
        boxShadow: '0 10px 25px -5px rgba(14, 26, 58, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Grand Monogramme Avatar avec bordure dorée */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: candidate.status === 'disparu'
                ? 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)'
                : 'linear-gradient(135deg, var(--color-gold) 0%, #B88E1F 100%)',
              color: 'var(--color-navy)',
              fontWeight: '900',
              fontSize: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2.5px solid #FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              {candidate.firstName[0]}{candidate.lastName[0]}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <span style={{
                  backgroundColor: 'rgba(212, 167, 44, 0.2)',
                  color: 'var(--color-gold)',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(212, 167, 44, 0.4)'
                }}>
                  {candidate.job}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                {candidate.neighborhood} • Tél : <strong>{candidate.phone}</strong>
              </p>
            </div>
          </div>

          {/* Badge Score de Confiance Certifié */}
          <div style={{
            backgroundColor: scoreInfo.bg,
            border: `1.5px solid ${scoreInfo.border}`,
            padding: '8px 14px',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: scoreInfo.color, textTransform: 'uppercase' }}>
              Score : {scoreInfo.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: scoreInfo.color }}>
              {candidate.trustScore}<span style={{ fontSize: '12px' }}>/100</span>
            </div>
          </div>
        </div>

        {/* Détails légaux & Garant */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          fontSize: '12px'
        }}>
          <div>
            <span style={{ color: '#94A3B8', display: 'block' }}>Salaire négocié :</span>
            <strong style={{ fontSize: '14px', color: 'var(--color-gold)' }}>
              {candidate.desiredSalary.toLocaleString('fr-FR')} FCFA/mois
            </strong>
          </div>

          <div>
            <span style={{ color: '#94A3B8', display: 'block' }}>Pièce d'identité :</span>
            <strong style={{ color: '#FFFFFF' }}>{candidate.idCardRef}</strong>
          </div>

          <div>
            <span style={{ color: '#94A3B8', display: 'block' }}>Garant officiel :</span>
            <strong style={{ color: '#FFFFFF' }}>
              {candidate.guarantor?.name} ({candidate.guarantor?.relation})
            </strong>
            <div style={{ color: '#94A3B8', fontSize: '11px' }}>Tél : {candidate.guarantor?.phone}</div>
          </div>
        </div>
      </div>

      {/* Alerte si le candidat est disparu */}
      {candidate.status === 'disparu' && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1.5px solid #FCA5A5',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          color: '#7F1D1D'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '800', color: '#991B1B' }}>
            <AlertTriangleIcon size={20} color="#DC2626" />
            Candidat signalé en DISPARITION / ABANDON DE POSTE
          </div>
          <p style={{ fontSize: '13px', marginTop: '6px', lineHeight: 1.4 }}>
            <strong>Motif enregistré :</strong> {candidate.disappearanceDetails?.reason || 'Abandon de poste avec dette'}
          </p>
          <div style={{ fontSize: '11px', color: '#991B1B', marginTop: '6px' }}>
            Date du signalement : {candidate.disappearanceDetails?.date} • Dossier prioritaire
          </div>
        </div>
      )}

      {/* ========================================================
          2. SUIVI DU PLACEMENT EN COURS ET DE LA COMMISSION
          ======================================================== */}
      {placement ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
              Placement en cours chez {client?.name}
            </h3>
            <span style={{
              backgroundColor: '#DCFCE7',
              color: '#166534',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              Contrat Actif
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '16px',
            fontSize: '12px'
          }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date de début :</span>
              <strong>{new Date(placement.startDate).toLocaleDateString('fr-FR')}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date de fin de contrat :</span>
              <strong style={{ color: '#DC2626' }}>{new Date(placement.endDate).toLocaleDateString('fr-FR')}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Commission Totale :</span>
              <strong style={{ fontSize: '14px', color: 'var(--color-navy)' }}>
                {totalCommission.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Reste à régler :</span>
              <strong style={{ fontSize: '14px', color: remainingCommission > 0 ? '#DC2626' : 'var(--badge-green-text)' }}>
                {remainingCommission.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
          </div>

          {/* Échéances détaillées */}
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Échéancier de la commission :
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(placement.installments || []).map(inst => (
              <div 
                key={inst.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: inst.status === 'payé' ? '#F0FDF4' : inst.status === 'en_retard' ? '#FEF2F2' : '#FFFFFF',
                  border: `1px solid ${inst.status === 'payé' ? '#BBF7D0' : inst.status === 'en_retard' ? '#FECACA' : '#E2E8F0'}`,
                  fontSize: '12px'
                }}
              >
                <div>
                  <strong>{inst.label}</strong> : {inst.amount.toLocaleString('fr-FR')} FCFA
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Échéance : {inst.dueDate} {inst.paidAt ? `• Réglé le ${inst.paidAt} (${inst.paymentMethod})` : ''}
                  </div>
                </div>

                <div>
                  {inst.status === 'payé' ? (
                    <span style={{ color: '#166534', fontWeight: '700', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                      ✓ Payé
                    </span>
                  ) : inst.status === 'en_retard' ? (
                    <span style={{ color: '#991B1B', fontWeight: '700', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '4px' }}>
                      ⚠️ En retard
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-navy)', fontWeight: '600', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
                      En attente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
          Ce candidat n'a pas de placement actif en ce moment. Il est <strong>Disponible</strong>.
        </div>
      )}

      {/* ========================================================
          3. HISTORIQUE VISIBLE DU SCORE DE CONFIANCE
          ======================================================== */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px' }}>
          Historique des Événements du Score de Confiance
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(candidate.scoreHistory || []).map(event => (
            <div 
              key={event.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '12px'
              }}
            >
              <div>
                <strong style={{ color: 'var(--color-navy)' }}>{event.reason}</strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Date : {event.date}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontWeight: '800',
                  color: event.change > 0 ? '#15803D' : event.change < 0 ? '#DC2626' : 'var(--color-navy)'
                }}>
                  {event.change > 0 ? `+${event.change}` : event.change} pts
                </span>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Nouveau score : {event.newScore}/100
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          ESPACE EMPLOYÉ DÉDIÉ : LIEN, DOCUMENTS, SCORE & URGENCES
          ======================================================== */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        border: '1.5px solid var(--color-border)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📱</span>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
              Espace Mobile Employé (Documents, Score & Urgences)
            </h3>
          </div>
          <span style={{
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            Lien sécurisé sans mot de passe
          </span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 14px 0', lineHeight: 1.45 }}>
          Envoyez ce lien à {candidate.firstName}. Il lui permet de consulter ses documents officiels, son contrat, son score de confiance certifié, et de <strong>vous alerter en 1 clic en cas d'urgence ou de litige</strong>.
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/${(candidate.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${candidate.firstName}, voici votre lien officiel d'accès à votre Espace Employé PlacePro (${agency.name}) :\n\n${getWorkerPortalLink(candidate.id)}\n\nVous pouvez y consulter vos documents, votre score de confiance et nous envoyer un signalement en cas de problème urgent.`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '12px',
              padding: '8px 14px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Envoyer sur WhatsApp
          </a>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(getWorkerPortalLink(candidate.id));
              }
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="btn btn-outline"
            style={{ fontSize: '12px', padding: '8px 14px', borderRadius: '8px' }}
          >
            {copiedLink ? '✓ Lien copié !' : 'Copier le lien'}
          </button>

          <button
            onClick={() => {
              setPortalEntityId(candidate.id);
              setPortalView('worker');
            }}
            className="btn"
            style={{
              backgroundColor: 'var(--color-navy)',
              color: 'var(--color-gold)',
              fontWeight: '700',
              fontSize: '12px',
              padding: '8px 14px',
              borderRadius: '8px'
            }}
          >
            👁️ Tester l'Espace (Aperçu)
          </button>
        </div>
      </div>

      {/* ========================================================
          4. LES 3 BOUTONS D'ACTIONS MAJEURS
          ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Action 1 : Enregistrer Paiement */}
        <button
          onClick={() => openPaymentForPlacement(placement?.id)}
          className="btn"
          style={{
            backgroundColor: 'var(--color-gold)',
            color: 'var(--color-navy)',
            fontWeight: '700',
            minHeight: '48px'
          }}
        >
          Enregistrer un paiement
        </button>

        {/* Action 2 : Relancer WhatsApp */}
        <a
          href={getWhatsAppReminderUrl()}
          target="_blank"
          rel="noreferrer"
          className="btn"
          style={{
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            fontWeight: '700',
            minHeight: '48px',
            textDecoration: 'none'
          }}
        >
          Relancer sur WhatsApp
        </a>

        {/* Action 3 : Signaler Disparition */}
        {candidate.status !== 'disparu' && (
          <button
            onClick={() => setIsDisappearanceModalOpen(true)}
            className="btn"
            style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              border: '1.5px solid #FCA5A5',
              fontWeight: '700',
              minHeight: '48px'
            }}
          >
            Signaler disparition
          </button>
        )}
      </div>

      {/* Bouton Retour */}
      <button 
        onClick={goBack} 
        className="btn btn-outline" 
        style={{ width: '100%', minHeight: '44px' }}
      >
        ← Retour à la liste
      </button>

      {/* Modale de signalement de disparition */}
      <ReportDisappearanceModal
        isOpen={isDisappearanceModalOpen}
        onClose={() => setIsDisappearanceModalOpen(false)}
        candidate={candidate}
      />
    </div>
  );
}
