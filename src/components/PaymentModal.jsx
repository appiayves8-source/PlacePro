import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ADMIN_CONFIG } from '../config/adminConfig';

export default function PaymentModal() {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    paymentModalData, 
    agency 
  } = useApp();

  const [selectedOperator, setSelectedOperator] = useState('wave'); // 'wave' | 'orange' | 'mtn'
  const [copied, setCopied] = useState(false);

  // Fermer avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPaymentModalOpen(false);
      }
    };
    if (isPaymentModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaymentModalOpen, setIsPaymentModalOpen]);

  if (!isPaymentModalOpen) return null;

  const planName = paymentModalData?.planName || 'Pro';
  const amount = paymentModalData?.amount || 39000;
  const period = paymentModalData?.period || '/mois';

  // Numéro officiel de Cyrille (Fondateur PlacePro) configuré dans .env
  const officialPhoneRaw = ADMIN_CONFIG.phoneRaw;
  const officialPhoneFormatted = ADMIN_CONFIG.phoneFormatted;
  const officialName = `${ADMIN_CONFIG.name} (${ADMIN_CONFIG.company})`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(officialPhoneRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const operatorInfo = {
    wave: {
      name: "Wave",
      badgeColor: "#00A3FF",
      badgeBg: "#E0F2FE",
      logo: "🐧",
      openAppUrl: "https://wave.com/send",
      instruction: "Ouvrez l'application Wave sur votre téléphone pour effectuer votre transfert sans frais cachés."
    },
    orange: {
      name: "Orange Money",
      badgeColor: "#FF6600",
      badgeBg: "#FFF1E6",
      logo: "🟠",
      openAppUrl: "tel:*144#",
      instruction: "Composez le #144# ou ouvrez l'application Orange Money (Max It) pour effectuer le transfert."
    },
    mtn: {
      name: "MTN MoMo",
      badgeColor: "#EAB308",
      badgeBg: "#FEF9C3",
      logo: "🟡",
      openAppUrl: "tel:*133#",
      instruction: "Composez le *133# ou utilisez l'application MoMo pour valider le transfert."
    }
  };

  const currentOp = operatorInfo[selectedOperator];

  // Message WhatsApp pré-rempli pour Cyrille
  const getWhatsAppConfirmationUrl = () => {
    const message = (
      `Bonjour Cyrille (PlacePro),\n\n` +
      `C'est ${agency.managerName || agency.name} de l'agence *« ${agency.name} »*.\n\n` +
      `Je viens d'effectuer le transfert de *${amount.toLocaleString('fr-FR')} FCFA* par *${currentOp.name}* pour notre formule *${planName}* (${period}).\n\n` +
      `Voici la capture d'écran du paiement pour la réactivation de notre espace. Merci !`
    );
    return ADMIN_CONFIG.getWhatsAppLink(message);
  };

  return (
    <div 
      onClick={() => setIsPaymentModalOpen(false)} // Fermeture au clic à l'extérieur
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 26, 58, 0.78)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        zIndex: 99999,
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture lors d'un clic DANS la modale
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '450px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(14, 26, 58, 0.4)',
          overflow: 'hidden',
          border: '1.5px solid #CBD5E1',
          margin: 'auto',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        
        {/* En-tête de la modale TOUJOURS visible avec bouton croix visible */}
        <div style={{
          padding: '14px 18px',
          backgroundColor: 'var(--color-navy)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--color-gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Règlement Mobile Money
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: '2px 0 0 0', color: '#FFFFFF' }}>
              Abonnement {planName}
            </h2>
          </div>

          {/* Bouton croix (✕) bien visible et contrasté */}
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
              flexShrink: 0
            }}
            title="Fermer la fenêtre (ou cliquez autour)"
          >
            ✕
          </button>
        </div>

        {/* Corps de la modale scrollable si petit écran */}
        <div style={{ padding: '16px 18px', overflowY: 'auto' }}>
          
          {/* Montant & Formule */}
          <div style={{
            backgroundColor: '#FAF5EA',
            border: '1.5px solid var(--color-gold-border)',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center',
            marginBottom: '14px'
          }}>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Montant net à transférer :</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-navy)', marginTop: '2px' }}>
              {amount.toLocaleString('fr-FR')} <span style={{ fontSize: '15px', color: 'var(--color-gold)' }}>FCFA</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Espace : <strong>{agency.name}</strong> • {period}
            </div>
          </div>

          {/* Choix de l'opérateur (Onglets Wave / Orange / MTN) */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
              Choisissez votre opérateur :
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              
              {/* Wave */}
              <button
                type="button"
                onClick={() => setSelectedOperator('wave')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '10px',
                  border: selectedOperator === 'wave' ? '2px solid #00A3FF' : '1px solid #CBD5E1',
                  backgroundColor: selectedOperator === 'wave' ? '#E0F2FE' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span style={{ fontSize: '18px' }}>🐧</span>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: selectedOperator === 'wave' ? '#0284C7' : '#334155' }}>Wave</span>
              </button>

              {/* Orange Money */}
              <button
                type="button"
                onClick={() => setSelectedOperator('orange')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '10px',
                  border: selectedOperator === 'orange' ? '2px solid #FF6600' : '1px solid #CBD5E1',
                  backgroundColor: selectedOperator === 'orange' ? '#FFF1E6' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span style={{ fontSize: '18px' }}>🟠</span>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: selectedOperator === 'orange' ? '#C2410C' : '#334155' }}>Orange</span>
              </button>

              {/* MTN MoMo */}
              <button
                type="button"
                onClick={() => setSelectedOperator('mtn')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '10px',
                  border: selectedOperator === 'mtn' ? '2px solid #EAB308' : '1px solid #CBD5E1',
                  backgroundColor: selectedOperator === 'mtn' ? '#FEF9C3' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span style={{ fontSize: '18px' }}>🟡</span>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: selectedOperator === 'mtn' ? '#854D0E' : '#334155' }}>MTN</span>
              </button>
            </div>
          </div>

          {/* Coordonnées & Bouton Copier */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Numéro du destinataire :</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: currentOp.badgeColor }}>
                {currentOp.logo} {currentOp.name}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              padding: '8px 10px',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--color-navy)', letterSpacing: '0.5px' }}>
                  {officialPhoneFormatted}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                  Bénéficiaire : <strong>{officialName}</strong>
                </div>
              </div>

              {/* Bouton de copie 1 clic */}
              <button
                type="button"
                onClick={handleCopyPhone}
                style={{
                  backgroundColor: copied ? '#DCFCE7' : 'var(--color-navy)',
                  color: copied ? '#15803D' : '#FFFFFF',
                  border: copied ? '1px solid #86EFAC' : 'none',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>{copied ? '✓' : '📋'}</span>
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            {/* Bouton d'ouverture directe de Wave sur smartphone */}
            {selectedOperator === 'wave' && (
              <a
                href={currentOp.openAppUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#00A3FF',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  boxShadow: '0 2px 8px rgba(0, 163, 255, 0.25)',
                  marginBottom: '4px'
                }}
              >
                <span>📱</span>
                <span>Ouvrir l'application Wave</span>
              </a>
            )}

            <p style={{ fontSize: '10.5px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.35 }}>
              {currentOp.instruction}
            </p>
          </div>

          {/* Étape Finale : Envoyer la capture sur WhatsApp */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#166534', marginBottom: '6px', textTransform: 'uppercase' }}>
              Étape 2 : Confirmation immédiate
            </div>

            <a
              href={getWhatsAppConfirmationUrl()}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: '800',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                cursor: 'pointer'
              }}
            >
              <span>💬</span>
              <span>J'ai payé, envoyer la capture WhatsApp</span>
            </a>

            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11.5px',
                  color: '#64748B',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Fermer sans payer
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
