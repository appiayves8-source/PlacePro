import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { ADMIN_CONFIG } from '../config/adminConfig';

export default function SubscriptionView() {
  const { agency, updateAgencyPlan, openSubscriptionPayment } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState(() => {
    const match = SUBSCRIPTION_PLANS.find(p => p.name.toLowerCase() === (agency.plan || '').toLowerCase());
    return match ? match.id : 'pro';
  });
  const [changeFeedback, setChangeFeedback] = useState(null);

  // Calcul des jours restants
  const today = new Date();
  const expiryDate = agency.subscriptionExpiry ? new Date(agency.subscriptionExpiry) : today;
  const diffTime = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const isTrial = agency.subscriptionStatus === 'trial';
  const isExpired = agency.subscriptionStatus === 'expired';
  const isWarning = agency.subscriptionStatus === 'warning';

  // Numéro officiel de Cyrille / PlacePro
  const adminPhone = ADMIN_CONFIG.phoneWhatsApp;

  const getWhatsAppPayUrl = (plan) => {
    const fee = plan.price.toLocaleString('fr-FR');
    const message = (
      `Bonjour Cyrille (PlacePro),\n\nC'est ${agency.managerName || agency.name} de l'agence *« ${agency.name} »*.\n\nJe souhaite activer/renouveler notre abonnement sur la formule *${plan.name}* (*${fee} FCFA* ${plan.period}).\n\nMerci de me confirmer le règlement Wave / MTN MoMo pour la prise en compte immédiate !`
    );
    return ADMIN_CONFIG.getWhatsAppLink(message);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlanId(plan.id);
    updateAgencyPlan(agency.agency_id, plan.name, plan.price);
    setChangeFeedback(`Formule mise à jour : ${plan.name} (${plan.formattedPrice} ${plan.period})`);
    setTimeout(() => setChangeFeedback(null), 3500);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1080px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. En-tête */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FAF5EA',
          border: '1px solid var(--color-gold-border)',
          color: 'var(--color-navy)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: '800',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <span>💳 GESTION DE VOTRE ESPACE</span>
          <span>•</span>
          <span>{agency.name}</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.5px' }}>
          Mon Abonnement PlacePro
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', maxWidth: '640px', lineHeight: 1.5 }}>
          Consultez votre formule actuelle, suivez votre période de validité et réglez facilement votre abonnement par Mobile Money (Wave ou MTN MoMo).
        </p>
      </div>

      {/* Message de confirmation de changement de formule */}
      {changeFeedback && (
        <div style={{
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          border: '1px solid #86EFAC',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <span>✓</span>
          <span>{changeFeedback}</span>
        </div>
      )}

      {/* 2. Carte État de validité actuel */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1.5px solid var(--color-border)',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            backgroundColor: isTrial ? '#FAF5EA' : isExpired ? '#FEF2F2' : '#DCFCE7',
            color: isTrial ? 'var(--color-gold)' : isExpired ? '#DC2626' : '#15803D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            border: `1.5px solid ${isTrial ? 'var(--color-gold-border)' : isExpired ? '#FCA5A5' : '#86EFAC'}`
          }}>
            {isTrial ? '🎁' : isExpired ? '🔒' : '✓'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: isTrial ? '#FEF3C7' : isExpired ? '#FEE2E2' : '#DCFCE7',
                color: isTrial ? '#92400E' : isExpired ? '#991B1B' : '#166534'
              }}>
                {isTrial ? "Période d'essai 7 jours" : isExpired ? "Abonnement Expiré" : "Abonnement Actif"}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-navy)' }}>
                • Formule : {agency.plan || 'Pro'}
              </span>
            </div>

            <div style={{ fontSize: '14px', color: 'var(--color-text-main)', fontWeight: '600' }}>
              {isTrial ? (
                <span>Il vous reste <strong>{daysRemaining} jour(s) d'essai gratuit</strong> (jusqu'au {expiryDate.toLocaleDateString('fr-FR')}).</span>
              ) : isExpired ? (
                <span style={{ color: '#DC2626' }}>Votre accès est arrivé à échéance le {expiryDate.toLocaleDateString('fr-FR')}.</span>
              ) : (
                <span>Valide jusqu'au <strong>{expiryDate.toLocaleDateString('fr-FR')}</strong> ({daysRemaining} jours restants).</span>
              )}
            </div>
          </div>
        </div>

        {/* Bouton de contact WhatsApp d'assistance */}
        <a
          href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(`Bonjour Cyrille, c'est ${agency.name}. J'ai une question concernant mon abonnement PlacePro.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{
            fontSize: '12px',
            fontWeight: '700',
            padding: '10px 16px',
            borderRadius: '10px',
            color: 'var(--color-navy)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <span>💬</span>
          <span>Assistance Cyrille</span>
        </a>
      </div>

      {/* 3. Grille des 3 Formules PlacePro */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', margin: '0 0 6px 0' }}>
          Choisissez la formule adaptée à votre agence
        </h2>
        <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 20px 0' }}>
          Sélectionnez votre formule ci-dessous. Vous pouvez ensuite valider votre règlement instantanément via Wave ou MTN MoMo.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {SUBSCRIPTION_PLANS.map(plan => {
          const isCurrentPlan = (agency.plan || '').toLowerCase() === plan.name.toLowerCase();
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: plan.highlight 
                  ? '2.5px solid var(--color-gold)' 
                  : isSelected 
                    ? '2px solid var(--color-navy)' 
                    : '1.5px solid var(--color-border)',
                boxShadow: plan.highlight 
                  ? '0 12px 30px -8px rgba(212, 167, 44, 0.25)' 
                  : '0 4px 16px rgba(0,0,0,0.04)',
                padding: '26px 22px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Badge supérieur */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: plan.id === 'pro' ? 'var(--color-gold)' : '#10B981',
                  color: 'var(--color-navy)',
                  fontWeight: '900',
                  fontSize: '11px',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Titre & Description */}
              <div style={{ marginBottom: '14px', marginTop: plan.badge ? '4px' : '0' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-navy)', margin: 0 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', minHeight: '34px', lineHeight: 1.4 }}>
                  {plan.description}
                </p>
              </div>

              {/* Prix */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                padding: '12px 0',
                borderTop: '1px solid #F1F5F9',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '18px'
              }}>
                <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-navy)' }}>
                  {plan.price.toLocaleString('fr-FR')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-gold)' }}>
                  FCFA {plan.period}
                </span>
              </div>

              {/* Liste des fonctionnalités */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#334155', lineHeight: 1.4 }}>
                    <span style={{ color: '#10B981', fontWeight: '900', fontSize: '14px' }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Actions : Choisir la formule & Régler par Mobile Money */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isCurrentPlan ? (
                  <div style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}>
                    ✓ Votre Formule Actuelle
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="btn"
                    style={{
                      backgroundColor: isSelected ? '#FAF5EA' : '#F8FAFC',
                      border: isSelected ? '1.5px solid var(--color-gold)' : '1px solid #CBD5E1',
                      color: 'var(--color-navy)',
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      width: '100%',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ Forfait Sélectionné' : 'Sélectionner ce forfait'}
                  </button>
                )}

                {/* Bouton de règlement Mobile Money guidé */}
                <button
                  type="button"
                  onClick={() => openSubscriptionPayment(plan)}
                  className="btn"
                  style={{
                    backgroundColor: plan.highlight ? 'var(--color-gold)' : 'var(--color-navy)',
                    color: plan.highlight ? 'var(--color-navy)' : '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '12.5px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: plan.highlight 
                      ? '0 4px 14px rgba(212, 167, 44, 0.35)' 
                      : '0 4px 12px rgba(14, 26, 58, 0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <span style={{ color: plan.highlight ? 'var(--color-navy)' : '#FFFFFF' }}>
                    Payer {plan.price.toLocaleString('fr-FR')} F via Wave / OM
                  </span>
                  <span style={{ fontSize: '14px', color: plan.highlight ? 'var(--color-navy)' : '#FFFFFF' }}>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Encadré Modalités de paiement Mobile Money */}
      <div style={{
        backgroundColor: '#FAF5EA',
        borderRadius: '16px',
        border: '1.5px solid var(--color-gold-border)',
        padding: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '4px' }}>
            📱 Comment effectuer votre règlement ?
          </div>
          <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, maxWidth: '620px' }}>
            Effectuez simplement votre transfert <strong>Wave</strong> ou <strong>MTN MoMo</strong> vers le numéro officiel de la plateforme PlacePro : <strong>{ADMIN_CONFIG.phoneFormatted}</strong> (Cyrille / Fondateur). Votre espace est validé immédiatement dès réception du transfert.
          </div>
        </div>

        <button
          type="button"
          onClick={() => openSubscriptionPayment(SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1])}
          className="btn btn-navy"
          style={{
            fontSize: '13px',
            fontWeight: '800',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            border: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          Procéder au règlement →
        </button>
      </div>

    </div>
  );
}
