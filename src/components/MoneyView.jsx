import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { WalletIcon, AlertTriangleIcon, CheckCircleIcon } from './Icons';

export default function MoneyView() {
  const { 
    payments, 
    placements, 
    candidates, 
    clients, 
    agency, 
    setIsRecordPaymentOpen,
    openPaymentForPlacement 
  } = useApp();

  const [activeTab, setActiveTab] = useState('receipts'); // 'receipts' | 'placements'

  // Calculs financiers globaux
  const totalReceived = useMemo(() => {
    return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  const totalPending = useMemo(() => {
    return placements.reduce((sum, plc) => {
      const pending = (plc.installments || [])
        .filter(i => i.status === 'en_retard' || i.status === 'en_attente')
        .reduce((s, i) => s + i.amount, 0);
      return sum + pending;
    }, 0);
  }, [placements]);

  const totalOverdue = useMemo(() => {
    return placements.reduce((sum, plc) => {
      const overdue = (plc.installments || [])
        .filter(i => i.status === 'en_retard')
        .reduce((s, i) => s + i.amount, 0);
      return sum + overdue;
    }, 0);
  }, [placements]);

  // Helper WhatsApp pour renvoyer un reçu
  const getWhatsAppReceiptUrl = (pay) => {
    const matchingPlc = placements.find(p => p.id === pay.placementId);
    const client = matchingPlc ? clients.find(cl => cl.id === matchingPlc.clientId) : null;
    const phone = (client?.phone || '').replace(/[^0-9]/g, '');

    const message = encodeURIComponent(
      `*REÇU OFFICIEL DE PAIEMENT - ${agency.name}*\n` +
      `-----------------------------------------\n` +
      `N° Reçu : ${pay.receiptNumber}\n` +
      `Date : ${pay.paymentDate}\n` +
      `Payeur : ${pay.payerName}\n` +
      `Candidat placé : ${pay.candidateName}\n` +
      `Montant encaissé : *${pay.amount.toLocaleString('fr-FR')} FCFA*\n` +
      `Moyen de règlement : ${pay.paymentMethod}\n` +
      `Reste à devoir : ${pay.remainingAmount.toLocaleString('fr-FR')} FCFA\n` +
      `-----------------------------------------\n` +
      `${agency.name} vous remercie pour votre confiance !`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  // Helper WhatsApp pour relancer une tranche en retard
  const getWhatsAppOverdueUrl = (clientPhone, candidateName, amount) => {
    const phone = (clientPhone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour, c'est l'agence ${agency.name}.\n\nNous vous relançons concernant l'échéance de commission pour ${candidateName}.\n\nMontant en attente : ${Number(amount).toLocaleString('fr-FR')} FCFA.\n\nMerci d'effectuer le transfert par Wave, Orange Money ou MTN au ${agency.phone}. Bonne journée !`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const getMethodBadge = (method) => {
    switch (method) {
      case 'Wave':
        return { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' };
      case 'Orange Money':
        return { bg: '#FFEDD5', color: '#C2410C', border: '#FED7AA' };
      case 'MTN Mobile Money':
        return { bg: '#FEF9C3', color: '#854D0E', border: '#FEF08A' };
      case 'Moov Money':
        return { bg: '#F1F5F9', color: '#0F172A', border: '#CBD5E1' };
      default:
        return { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' };
    }
  };

  return (
    <div className="money-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ========================================================
          1. HERO BANNER : SUIVI FINANCIER & TRÉSORERIE (BLEU NUIT & OR)
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
        gap: '20px'
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
              <span>Comptabilité & Commissions d'Agence</span>
              <span>•</span>
              <span>{agency.name}</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
              Trésorerie & Suivi des Reçus
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', maxWidth: '540px' }}>
              Enregistrement des règlements Wave, Orange Money, MTN et génération automatique des reçus clients.
            </p>
          </div>

          <button
            onClick={() => setIsRecordPaymentOpen(true)}
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
            + Enregistrer un Paiement
          </button>
        </div>

        {/* 3 Cartes de métriques financières */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          paddingTop: '8px'
        }}>
          {/* Carte 1 : Total Encaissé */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            padding: '16px',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Total Encaissé</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#86EFAC', marginTop: '4px' }}>
              {totalReceived.toLocaleString('fr-FR')} <span style={{ fontSize: '12px' }}>FCFA</span>
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '4px' }}>
              {payments.length} reçus délivrés
            </div>
          </div>

          {/* Carte 2 : Argent à Récupérer */}
          <div style={{
            backgroundColor: 'rgba(212, 167, 44, 0.12)',
            border: '1px solid rgba(212, 167, 44, 0.3)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--color-gold)', fontWeight: '600' }}>À Récupérer ce mois</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-gold)', marginTop: '4px' }}>
              {totalPending.toLocaleString('fr-FR')} <span style={{ fontSize: '12px' }}>FCFA</span>
            </div>
            <div style={{ fontSize: '11px', color: '#E2E8F0', marginTop: '4px' }}>
              Commissions en attente
            </div>
          </div>

          {/* Carte 3 : En retard */}
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: '#FCA5A5', fontWeight: '600' }}>Retards de paiement (&gt; 7j)</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#FCA5A5', marginTop: '4px' }}>
              {totalOverdue.toLocaleString('fr-FR')} <span style={{ fontSize: '12px' }}>FCFA</span>
            </div>
            <div style={{ fontSize: '11px', color: '#FECACA', marginTop: '4px' }}>
              Relances WhatsApp requises
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. SÉLECTEUR DE VUE : REÇUS DÉLIVRÉS VS PAR PLACEMENT
          ======================================================== */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('receipts')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'receipts' ? 'var(--color-navy)' : '#FFFFFF',
            color: activeTab === 'receipts' ? '#FFFFFF' : 'var(--color-navy)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
          }}
        >
          Reçus Officiels Délivrés ({payments.length})
        </button>

        <button
          onClick={() => setActiveTab('placements')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'placements' ? 'var(--color-navy)' : '#FFFFFF',
            color: activeTab === 'placements' ? '#FFFFFF' : 'var(--color-navy)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
          }}
        >
          Suivi des Commissions par Placement
        </button>
      </div>

      {/* ========================================================
          3. VUE 1 : GALERIE DES REÇUS OFFICIELS
          ======================================================== */}
      {activeTab === 'receipts' && (
        payments.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '60px 24px',
            textAlign: 'center',
            border: '1.5px dashed #CBD5E1'
          }}>
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>🧾</div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '8px' }}>
              Aucun encaissement pour l'instant
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
              Enregistrez vos règlements par Wave, Orange Money ou MTN pour générer des reçus officiels avec QR Code pour vos clients.
            </p>
            <button
              onClick={() => setIsRecordPaymentOpen(true)}
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
              <span>Enregistrer un paiement</span>
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px'
          }}>
            {payments.map(pay => {
            const methodInfo = getMethodBadge(pay.paymentMethod);

            return (
              <div
                key={pay.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  {/* En-tête du Reçu */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        REÇU DE COMMISSION
                      </span>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--color-navy)' }}>
                        {pay.receiptNumber}
                      </div>
                    </div>

                    <span style={{
                      backgroundColor: methodInfo.bg,
                      color: methodInfo.color,
                      border: `1px solid ${methodInfo.border}`,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      {pay.paymentMethod}
                    </span>
                  </div>

                  {/* Montant & Payeur */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Montant Encaissé</div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-navy)', letterSpacing: '-0.5px' }}>
                      {pay.amount.toLocaleString('fr-FR')} <span style={{ fontSize: '12px', fontWeight: '600' }}>FCFA</span>
                    </div>
                  </div>

                  {/* Détails du règlement */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Date :</span>
                      <strong>{new Date(pay.paymentDate).toLocaleDateString('fr-FR')}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Payeur :</span>
                      <strong>{pay.payerName}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Candidat :</span>
                      <strong>{pay.candidateName}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid #E2E8F0' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Reste dû :</span>
                      <strong style={{ color: pay.remainingAmount > 0 ? '#DC2626' : 'var(--badge-green-text)' }}>
                        {pay.remainingAmount.toLocaleString('fr-FR')} FCFA
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bouton de Partage WhatsApp */}
                <a
                  href={getWhatsAppReceiptUrl(pay)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    width: '100%',
                    textDecoration: 'none',
                    minHeight: '40px'
                  }}
                >
                  Partager ce Reçu sur WhatsApp
                </a>
              </div>
            );
          })}
        </div>
        )
      )}

      {/* ========================================================
          4. VUE 2 : COMMISSIONS PAR PLACEMENT
          ======================================================== */}
      {activeTab === 'placements' && (
        placements.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1.5px dashed #CBD5E1'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '6px' }}>
              Aucun suivi de commission pour l'instant
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
              Les commissions et leurs tranches s'afficheront ici automatiquement dès que vous aurez créé des contrats de placement.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {placements.map(plc => {
            const cand = candidates.find(c => c.id === plc.candidateId);
            const client = clients.find(cl => cl.id === plc.clientId);
            const totalPaid = (plc.installments || []).filter(i => i.status === 'payé').reduce((s, i) => s + i.amount, 0);
            const totalRemaining = Math.max(0, plc.totalCommission - totalPaid);

            return (
              <div
                key={plc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
                      {cand?.firstName} {cand?.lastName} ({cand?.job}) ➔ {client?.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Commission totale : <strong>{plc.totalCommission.toLocaleString('fr-FR')} FCFA</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Reste à percevoir</div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: totalRemaining > 0 ? '#DC2626' : 'var(--badge-green-text)' }}>
                      {totalRemaining.toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                </div>

                {/* Tranches */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {(plc.installments || []).map(inst => (
                    <div
                      key={inst.id}
                      style={{
                        backgroundColor: inst.status === 'payé' ? '#F0FDF4' : inst.status === 'en_retard' ? '#FEF2F2' : '#F8FAFC',
                        border: `1px solid ${inst.status === 'payé' ? '#BBF7D0' : inst.status === 'en_retard' ? '#FECACA' : '#E2E8F0'}`,
                        borderRadius: '10px',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-navy)' }}>
                          {inst.label} : {inst.amount.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          Échéance : {inst.dueDate} {inst.paidAt ? `• Réglé le ${inst.paidAt}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {inst.status === 'payé' ? (
                          <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontWeight: '800', fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>
                            ✓ Soldé
                          </span>
                        ) : (
                          <>
                            {inst.status === 'en_retard' && (
                              <a
                                href={getWhatsAppOverdueUrl(client?.phone, cand?.firstName, inst.amount)}
                                target="_blank"
                                rel="noreferrer"
                                className="btn"
                                style={{
                                  backgroundColor: '#25D366',
                                  color: '#FFFFFF',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '4px 10px',
                                  minHeight: '32px',
                                  textDecoration: 'none'
                                }}
                              >
                                Relance
                              </a>
                            )}
                            <button
                              onClick={() => openPaymentForPlacement(plc.id)}
                              className="btn"
                              style={{
                                backgroundColor: 'var(--color-gold)',
                                color: 'var(--color-navy)',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '4px 10px',
                                minHeight: '32px'
                              }}
                            >
                              Encaisser
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )
      )}

    </div>
  );
}
