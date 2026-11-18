import React from 'react';
import { useApp } from '../context/AppContext';
import { ADMIN_CONFIG } from '../config/adminConfig';

export default function AgencyLockScreen() {
  const { 
    agency, 
    logout,
    openSubscriptionPayment
  } = useApp();

  const getWhatsAppRenewUrl = () => {
    const message = (
      `Bonjour Cyrille (PlacePro), c'est ${agency.managerName || agency.name}.\n\nJe souhaite renouveler l'abonnement PlacePro de mon agence (*${agency.name}*).\n\nFormule : ${agency.plan || 'Pro'} (${(agency.monthlyFee || 39000).toLocaleString('fr-FR')} FCFA).\n\nMerci de me confirmer la réception du règlement Wave/OM pour la réactivation immédiate.`
    );
    return ADMIN_CONFIG.getWhatsAppLink(message);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px 28px',
        maxWidth: '540px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(14, 26, 58, 0.15)',
        border: '1.5px solid #FCA5A5',
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* Monogramme Agence */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '20px',
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
          fontSize: '28px',
          border: '2px solid #FCA5A5'
        }}>
          🔒
        </div>

        {/* Badge d'expiration */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#FEF2F2',
          color: '#991B1B',
          fontSize: '11px',
          fontWeight: '800',
          padding: '4px 12px',
          borderRadius: '9999px',
          border: '1px solid #FCA5A5',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>
          Accès Suspendu • Abonnement Expiré
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-navy)', margin: '0 0 6px 0' }}>
          {agency.name}
        </h1>

        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          L'abonnement PlacePro de votre agence est arrivé à échéance le <strong>{new Date(agency.subscriptionExpiry || Date.now()).toLocaleDateString('fr-FR')}</strong>.
        </p>

        {/* Encadré d'assurance données */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '14px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          textAlign: 'left',
          marginBottom: '24px',
          fontSize: '12px',
          color: 'var(--color-navy)',
          lineHeight: 1.5
        }}>
          <div style={{ fontWeight: '800', marginBottom: '4px', color: '#0F172A' }}>
            🛡️ Vos données sont protégées et conservées :
          </div>
          <div style={{ color: '#475569' }}>
            Tous vos candidats enregistrés, vos contrats en cours et vos justificatifs de paiement restent précieusement archivés. Ils seront immédiatement accessibles dès la régularisation.
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>Montant du renouvellement :</span>
            <strong style={{ fontSize: '14px', color: 'var(--color-gold)' }}>
              {(agency.monthlyFee || 25000).toLocaleString('fr-FR')} FCFA / mois
            </strong>
          </div>
        </div>

        {/* Bouton direct de règlement Wave / WhatsApp */}
        {/* Bouton direct d'ouverture du parcours Mobile Money */}
        <button
          onClick={() => openSubscriptionPayment({
            name: agency.plan || 'Pro',
            price: agency.monthlyFee || 39000,
            period: '/mois'
          })}
          className="btn"
          style={{
            width: '100%',
            backgroundColor: '#00A3FF',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '800',
            padding: '14px 20px',
            borderRadius: '12px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(0, 163, 255, 0.35)',
            marginBottom: '16px',
            cursor: 'pointer'
          }}
        >
          <span>📱</span>
          <span>Régler par Wave ou MTN MoMo</span>
        </button>

        {/* Bouton de déconnexion pour changer d'agence ou quitter */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{
              width: '100%',
              fontSize: '13px',
              fontWeight: '700',
              padding: '12px 18px',
              borderRadius: '12px',
              borderColor: '#CBD5E1',
              color: 'var(--color-navy)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>←</span>
            <span>Se déconnecter / Changer d'agence</span>
          </button>
        </div>
      </div>
    </div>
  );
}
