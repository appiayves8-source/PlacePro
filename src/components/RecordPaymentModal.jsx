import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RecordPaymentModal() {
  const { 
    isRecordPaymentOpen, 
    setIsRecordPaymentOpen, 
    placements, 
    candidates, 
    clients, 
    agency, 
    recordPayment,
    activePaymentPlacement,
    navigateTo 
  } = useApp();

  const [selectedPlacementId, setSelectedPlacementId] = useState(() => {
    return activePaymentPlacement ? activePaymentPlacement.id : (placements[0]?.id || '');
  });

  const activePlc = placements.find(p => p.id === (activePaymentPlacement ? activePaymentPlacement.id : selectedPlacementId)) || placements[0];
  const activeCand = activePlc ? candidates.find(c => c.id === activePlc.candidateId) : null;
  const activeCli = activePlc ? clients.find(cl => cl.id === activePlc.clientId) : null;

  const [amount, setAmount] = useState('60000');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Wave');
  const [payerName, setPayerName] = useState(() => activeCli?.name || 'Client');
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  // Synchronisation des informations du placement lors de l'ouverture
  React.useEffect(() => {
    if (isRecordPaymentOpen) {
      setGeneratedReceipt(null);
      if (activePaymentPlacement) {
        setSelectedPlacementId(activePaymentPlacement.id);
        const nextInst = (activePaymentPlacement.installments || []).find(i => i.status === 'en_retard' || i.status === 'en_attente');
        if (nextInst) {
          setAmount(nextInst.amount.toString());
        }
      }
      if (activeCli?.name) {
        setPayerName(activeCli.name);
      }
    }
  }, [isRecordPaymentOpen, activePaymentPlacement, activeCli]);

  if (!isRecordPaymentOpen) return null;

  const paymentMethods = [
    'Wave',
    'Orange Money',
    'MTN Mobile Money',
    'Moov Money',
    'Espèces'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }

    const receipt = recordPayment({
      placementId: activePlc?.id,
      installmentId: activePlc?.installments?.find(i => i.status === 'en_retard')?.id || activePlc?.installments?.[0]?.id,
      candidateName: activeCand ? `${activeCand.firstName} ${activeCand.lastName}` : 'Candidat',
      payerName: payerName.trim() || activeCli?.name || 'Client',
      amount: Number(amount),
      paymentDate,
      paymentMethod,
      remainingAmount: Math.max(0, (activePlc?.totalCommission || 0) - Number(amount)),
      notes: `Règlement commission reçu par ${paymentMethod}`
    });

    setGeneratedReceipt(receipt);
  };

  const getWhatsAppShareUrl = () => {
    if (!generatedReceipt) return '';
    const phone = (activeCli?.phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `*REÇU OFFICIEL DE PAIEMENT - ${agency.name}*\n` +
      `-----------------------------------------\n` +
      `N° de Reçu : ${generatedReceipt.receiptNumber}\n` +
      `Date : ${paymentDate}\n` +
      `Payeur : ${generatedReceipt.payerName}\n` +
      `Motif : Commission de placement - ${generatedReceipt.candidateName}\n` +
      `Montant reçu : *${generatedReceipt.amount.toLocaleString('fr-FR')} FCFA*\n` +
      `Moyen de règlement : ${generatedReceipt.paymentMethod}\n` +
      `Reste à payer : ${generatedReceipt.remainingAmount.toLocaleString('fr-FR')} FCFA\n` +
      `-----------------------------------------\n` +
      `Merci pour votre confiance. ${agency.name} vous remercie !`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const handleClose = () => {
    setIsRecordPaymentOpen(false);
    setGeneratedReceipt(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(14, 26, 58, 0.65)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        position: 'relative'
      }}>
        {/* En-tête */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
              {generatedReceipt ? 'Reçu de Paiement Officiel' : 'Enregistrer un Paiement'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              {agency.name} • Saisie directe par l'agence
            </p>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Aperçu du Reçu Officiel généré */}
        {generatedReceipt ? (
          <div style={{ padding: '24px' }}>
            <div style={{
              backgroundColor: '#FAF5EA',
              border: '2px dashed var(--color-gold)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              position: 'relative'
            }}>
              {/* En-tête du reçu */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gold-border)', paddingBottom: '12px', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
                    {agency.name}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {agency.city} • Tél: {agency.phone}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                    REÇU DE RÈGLEMENT
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-navy)' }}>
                    N° {generatedReceipt.receiptNumber}
                  </div>
                </div>
              </div>

              {/* Détails du reçu */}
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Date du paiement :</span>
                  <strong>{new Date(generatedReceipt.paymentDate).toLocaleDateString('fr-FR')}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Payeur :</span>
                  <strong>{generatedReceipt.payerName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Candidat placé :</span>
                  <strong>{generatedReceipt.candidateName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Moyen de paiement :</span>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '12px' }}>
                    {generatedReceipt.paymentMethod}
                  </span>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-gold-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)' }}>
                    Montant Encaissé :
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-navy)' }}>
                    {generatedReceipt.amount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: generatedReceipt.remainingAmount > 0 ? '#DC2626' : 'var(--status-green)' }}>
                  <span>Reste à devoir :</span>
                  <strong>{generatedReceipt.remainingAmount.toLocaleString('fr-FR')} FCFA</strong>
                </div>
              </div>
            </div>

            {/* Actions Reçu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  width: '100%',
                  textDecoration: 'none'
                }}
              >
                Partager ce reçu sur WhatsApp
              </a>

              <button
                type="button"
                onClick={() => {
                  alert("Le reçu a été enregistré dans l'historique financier.");
                  handleClose();
                  navigateTo('money');
                }}
                className="btn btn-navy"
                style={{ width: '100%' }}
              >
                Terminer & Voir l'espace Argent
              </button>
            </div>
          </div>
        ) : (
          /* Formulaire de paiement */
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                Placement / Dossier concerné *
              </label>
              <select
                value={selectedPlacementId}
                onChange={(e) => {
                  setSelectedPlacementId(e.target.value);
                  const p = placements.find(plc => plc.id === e.target.value);
                  const cl = p ? clients.find(c => c.id === p.clientId) : null;
                  if (cl) setPayerName(cl.name);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {placements.map(plc => {
                  const c = candidates.find(cand => cand.id === plc.candidateId);
                  const cl = clients.find(client => client.id === plc.clientId);
                  return (
                    <option key={plc.id} value={plc.id}>
                      {c ? `${c.firstName} ${c.lastName}` : 'Candidat'} chez {cl?.name} ({plc.totalCommission.toLocaleString('fr-FR')} FCFA)
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Montant encaissé (FCFA) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Entrez le montant encaissé (FCFA)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Moyen de paiement *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: '600'
                  }}
                >
                  {paymentMethods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Nom du payeur *
                </label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Entrez le nom du payeur"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Date d'encaissement *
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-navy"
                style={{ backgroundColor: 'var(--color-navy)' }}
              >
                Valider & Générer le Reçu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
