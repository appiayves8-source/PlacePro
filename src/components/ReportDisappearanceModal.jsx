import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ReportDisappearanceModal({ isOpen, onClose, candidate }) {
  const { reportDisappearance, navigateTo } = useApp();
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Le motif de la disparition ou de l'abandon de poste est obligatoire.");
      return;
    }
    if (!confirmed) {
      setError("Veuillez cocher la confirmation solennelle de signalement.");
      return;
    }

    reportDisappearance(candidate.id, reason.trim());
    alert(`${candidate.firstName} ${candidate.lastName} a été marqué comme DISPARU. Son score est passé à 0 et l'alerte a été transmise sur le tableau de bord.`);
    onClose();
    navigateTo('dashboard');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(14, 26, 58, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 120,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '2px solid #EF4444'
      }}>
        {/* En-tête d'alerte rouge */}
        <div style={{
          backgroundColor: '#FEE2E2',
          padding: '18px 24px',
          borderBottom: '1px solid #FECACA',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: '900'
          }}>
            ⚠️
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#991B1B', margin: 0 }}>
              Signaler une Disparition
            </h3>
            <p style={{ fontSize: '12px', color: '#7F1D1D', margin: '2px 0 0 0' }}>
              Candidat : {candidate.firstName} {candidate.lastName} ({candidate.job})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div style={{
            backgroundColor: '#FFF5F5',
            border: '1px solid #FED7D7',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '12px',
            color: '#742A2A',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            <strong>Conséquences immédiates :</strong><br />
            • Le statut passe immédiatement en <strong>« Disparu »</strong>.<br />
            • Le score de confiance tombe instantanément à <strong>0/100 (Risqué)</strong>.<br />
            • Le dossier apparaît en alerte prioritaire sur le tableau de bord de l'agence.
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
              Motif obligatoire du signalement *
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(null); }}
              rows={3}
              placeholder="Entrez les circonstances et détails du signalement..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '18px'
          }}>
            <input
              type="checkbox"
              id="confirmDisappearance"
              checked={confirmed}
              onChange={(e) => { setConfirmed(e.target.checked); setError(null); }}
              style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
            />
            <label htmlFor="confirmDisappearance" style={{ fontSize: '12px', color: 'var(--color-navy)', cursor: 'pointer', fontWeight: '600' }}>
              Je confirme solennellement que ce personnel a abandonné son poste ou a disparu avec une créance non réglée.
            </label>
          </div>

          {error && (
            <div style={{ color: '#DC2626', fontSize: '12px', fontWeight: '600', marginBottom: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: '700' }}
            >
              Confirmer la Disparition (Score 0)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
