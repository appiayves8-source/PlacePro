import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangleIcon, CheckCircleIcon } from './Icons';

export default function WorkerPortal({ candidateId }) {
  const { candidates, placements, clients, agency, sendWorkerEmergency, setPortalView } = useApp();

  const candidate = candidates.find(c => c.id === candidateId) || candidates[0];
  const placement = placements.find(p => p.candidateId === candidate?.id);
  const client = placement ? clients.find(cl => cl.id === placement.clientId) : null;

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [urgencyType, setUrgencyType] = useState('Non-paiement / Retard sur salaire');
  const [details, setDetails] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const urgencyTypes = [
    'Non-paiement / Retard sur salaire',
    'Maltraitance, insultes ou conflit grave',
    'Horaires non respectés / Travail abusif',
    'Urgence médicale / Maladie soudaine',
    'Problème de nourriture ou de logement',
    'Autre urgence grave'
  ];

  const handleSendEmergency = (e) => {
    e.preventDefault();
    if (!details.trim()) {
      alert("Veuillez préciser brièvement ce qui se passe.");
      return;
    }

    sendWorkerEmergency({
      candidateId: candidate.id,
      urgencyType,
      details: details.trim()
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsEmergencyModalOpen(false);
      setDetails('');
    }, 2500);
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      paddingBottom: '40px'
    }}>
      {/* Barre de retour vers le dashboard de l'agence pour Cyrille */}
      <div style={{
        backgroundColor: 'var(--color-navy)',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#FFFFFF',
        fontSize: '11px'
      }}>
        <span>Aperçu de ce que voit l'Employé(e)</span>
        <button
          onClick={() => {
            setPortalView(null);
            window.history.pushState({}, '', window.location.pathname);
          }}
          style={{
            backgroundColor: 'var(--color-gold)',
            color: 'var(--color-navy)',
            border: 'none',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Retour Dashboard Agence
        </button>
      </div>

      {/* En-tête de l'espace employé */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, #162955 100%)',
        color: '#FFFFFF',
        padding: '28px 20px 24px 20px',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 10px 20px -5px rgba(14, 26, 58, 0.2)'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
          Suivi officiel par {agency.name}
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0 2px 0' }}>
          Bonjour, {candidate.firstName} !
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
          Métier : <strong>{candidate.job}</strong> • Quartier : {candidate.neighborhood}
        </p>

        {/* Carte Score de Confiance de l'employé */}
        <div style={{
          marginTop: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(212, 167, 44, 0.3)',
          borderRadius: '16px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#CBD5E1' }}>Votre Score de Confiance</div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-gold)' }}>
              {candidate.trustScore}/100
            </div>
            <div style={{ fontSize: '11px', color: '#86EFAC' }}>
              ✓ Profil recommandé pour les meilleurs postes
            </div>
          </div>

          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold)',
            color: 'var(--color-navy)',
            fontWeight: '900',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ★
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* BOUTON D'URGENCE ROUGE MAJEUR */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          style={{
            width: '100%',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            border: 'none',
            fontSize: '15px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 20px -4px rgba(220, 38, 38, 0.4)',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          <span>🚨</span>
          <span>SIGNALER UNE URGENCE OU UN PROBLÈME</span>
        </button>

        {/* Contrat en cours */}
        {placement ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px',
            border: '1px solid var(--color-border)',
            marginBottom: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Votre Poste Actuel
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
              Chez {client?.name}
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              📍 Commune : <strong>{client?.neighborhood}</strong>
            </div>

            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Salaire mensuel :</span>
              <strong style={{ color: 'var(--color-navy)' }}>{placement.monthlySalary.toLocaleString('fr-FR')} FCFA</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '4px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Fin de contrat :</span>
              <strong>{new Date(placement.endDate).toLocaleDateString('fr-FR')}</strong>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid var(--color-border)',
            marginBottom: '16px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '13px'
          }}>
            Vous êtes actuellement en attente d'un nouveau placement par l'agence.
          </div>
        )}

        {/* Documents & Garant */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-navy)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Vos Documents & Dossier Enregistré
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Pièce d'identité :</span>
              <strong>{candidate.idCardRef}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Garant déclaré :</span>
              <strong>{candidate.guarantor?.name} ({candidate.guarantor?.relation})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Contact garant :</span>
              <strong>{candidate.guarantor?.phone}</strong>
            </div>
          </div>
        </div>

        {/* Assistance Agence */}
        <div style={{
          backgroundColor: '#FAF5EA',
          border: '1px solid var(--color-gold-border)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-navy)' }}>
            Besoin de parler à l'agence ?
          </div>
          <p style={{ fontSize: '12px', color: '#92400E', marginTop: '4px' }}>
            {agency.name} est à votre écoute pour vous protéger et vous accompagner.
          </p>
          <a
            href={`tel:${agency.phone}`}
            className="btn"
            style={{
              backgroundColor: 'var(--color-navy)',
              color: '#FFFFFF',
              width: '100%',
              marginTop: '10px',
              textDecoration: 'none'
            }}
          >
            Appeler l'Agence ({agency.phone})
          </a>
        </div>

      </div>

      {/* MODALE DE SIGNALEMENT D'URGENCE POUR L'EMPLOYÉ */}
      {isEmergencyModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14, 26, 58, 0.8)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            {submittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✓</div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-navy)' }}>
                  Alerte envoyée à l'agence !
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                  Votre responsable chez {agency.name} a été notifiée immédiatement. Elle va intervenir pour vous aider.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEmergency}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#DC2626', margin: 0 }}>
                    🚨 Signaler une Urgence
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEmergencyModalOpen(false)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                    Quel est le problème ? *
                  </label>
                  <select
                    value={urgencyType}
                    onChange={(e) => setUrgencyType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF',
                      fontWeight: '600'
                    }}
                  >
                    {urgencyTypes.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '6px' }}>
                    Expliquez ce qui s'est passé : *
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    placeholder="Décrivez votre situation ou votre demande d'assistance..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEmergencyModalOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      flex: 1,
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontWeight: '800'
                    }}
                  >
                    Envoyer l'Alerte
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
